import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest, createAuditLog } from '../middleware/auth.js';

const router = Router();

// Get all recommendations
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { status, type } = req.query;

    const where: any = {
      saasApp: { organizationId: req.user!.organizationId },
    };

    if (status && status !== 'all') {
      where.status = status;
    }
    if (type && type !== 'all') {
      where.type = type;
    }

    const recommendations = await prisma.recommendation.findMany({
      where,
      include: {
        saasApp: { select: { id: true, name: true, logo: true, category: true } },
        approvals: {
          include: { approvedBy: { select: { id: true, name: true } } },
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { estimatedAnnualSavings: 'desc' },
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Get recommendation by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;

    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: {
        saasApp: true,
        approvals: {
          include: { approvedBy: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

// Approve recommendation
router.post('/:id/approve', authenticate, authorize('admin', 'finance'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    await prisma.approval.create({
      data: {
        recommendationId: id,
        approvedByUserId: req.user!.id,
        approvedByName: user!.name,
        action: 'approved',
        reason,
      },
    });

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: { status: 'approved' },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      user!.name,
      'APPROVE_RECOMMENDATION',
      'recommendation',
      id,
      { title: recommendation.title, savings: recommendation.estimatedAnnualSavings },
      req.ip
    );

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve recommendation' });
  }
});

// Reject recommendation
router.post('/:id/reject', authenticate, authorize('admin', 'finance'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    await prisma.approval.create({
      data: {
        recommendationId: id,
        approvedByUserId: req.user!.id,
        approvedByName: user!.name,
        action: 'rejected',
        reason,
      },
    });

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: { status: 'rejected' },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      user!.name,
      'REJECT_RECOMMENDATION',
      'recommendation',
      id,
      { title: recommendation.title, reason },
      req.ip
    );

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject recommendation' });
  }
});

// Implement recommendation
router.post('/:id/implement', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: { status: 'implemented' },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      user!.name,
      'IMPLEMENT_RECOMMENDATION',
      'recommendation',
      id,
      { title: recommendation.title, savings: recommendation.estimatedAnnualSavings },
      req.ip
    );

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to implement recommendation' });
  }
});

export default router;
