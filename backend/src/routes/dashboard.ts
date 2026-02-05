import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get dashboard metrics
router.get('/metrics', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const orgId = req.user!.organizationId;

    // Get all apps for the organization
    const apps = await prisma.saaSApplication.findMany({
      where: { organizationId: orgId },
      include: {
        licenses: true,
        recommendations: { where: { status: 'pending' } },
      },
    });

    // Calculate metrics
    const totalSaasSpend = apps.reduce((sum, app) => {
      const monthlySpend = app.billingCycle === 'annual' 
        ? (app.costPerLicense * app.licensesPurchased) / 12
        : app.costPerLicense * app.licensesPurchased;
      return sum + monthlySpend;
    }, 0);

    const totalApps = apps.length;
    const activeUsers = apps.reduce((sum, app) => sum + app.licensesUsed, 0);
    const unusedLicenses = apps.reduce((sum, app) => sum + (app.licensesPurchased - app.licensesUsed), 0);

    const pendingRecommendations = await prisma.recommendation.findMany({
      where: {
        saasApp: { organizationId: orgId },
        status: 'pending',
      },
    });

    const potentialSavings = pendingRecommendations.reduce(
      (sum, rec) => sum + rec.estimatedAnnualSavings,
      0
    );

    // Upcoming renewals (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingRenewals = await prisma.saaSApplication.count({
      where: {
        organizationId: orgId,
        renewalDate: { lte: thirtyDaysFromNow, gte: new Date() },
      },
    });

    // Calculate optimization score (0-100)
    const utilizationRate = activeUsers / (activeUsers + unusedLicenses) || 0;
    const optimizationScore = Math.round(utilizationRate * 100);

    res.json({
      totalSaasSpend,
      monthlySpendTrend: 2.5, // This would be calculated from historical data
      totalApps,
      activeUsers,
      unusedLicenses,
      potentialSavings,
      upcomingRenewals,
      optimizationScore,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Get spend by category
router.get('/spend-by-category', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');

    const apps = await prisma.saaSApplication.findMany({
      where: { organizationId: req.user!.organizationId },
    });

    const categorySpend = apps.reduce((acc, app) => {
      const monthlySpend = app.billingCycle === 'annual'
        ? (app.costPerLicense * app.licensesPurchased) / 12
        : app.costPerLicense * app.licensesPurchased;

      if (!acc[app.category]) {
        acc[app.category] = { category: app.category, spend: 0, appsCount: 0 };
      }
      acc[app.category].spend += monthlySpend;
      acc[app.category].appsCount += 1;
      return acc;
    }, {} as Record<string, { category: string; spend: number; appsCount: number }>);

    res.json(Object.values(categorySpend));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spend by category' });
  }
});

// Get monthly spend trend
router.get('/spend-trend', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');

    const apps = await prisma.saaSApplication.findMany({
      where: { organizationId: req.user!.organizationId },
    });

    // Generate last 6 months of data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        spend: apps.reduce((sum, app) => {
          const monthlySpend = app.billingCycle === 'annual'
            ? (app.costPerLicense * app.licensesPurchased) / 12
            : app.costPerLicense * app.licensesPurchased;
          // Add some variance for demo
          return sum + monthlySpend * (0.9 + Math.random() * 0.2);
        }, 0),
        savings: Math.random() * 5000,
      });
    }

    res.json(months);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spend trend' });
  }
});

// Get upcoming renewals
router.get('/renewals', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');

    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    const renewals = await prisma.saaSApplication.findMany({
      where: {
        organizationId: req.user!.organizationId,
        renewalDate: { lte: ninetyDaysFromNow, gte: new Date() },
      },
      orderBy: { renewalDate: 'asc' },
      take: 10,
    });

    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renewals' });
  }
});

export default router;
