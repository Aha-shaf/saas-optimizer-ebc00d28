import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest, createAuditLog } from '../middleware/auth.js';

const router = Router();

// Get all SaaS apps
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { category, status, search } = req.query;

    const where: any = { organizationId: req.user!.organizationId };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { vendor: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const apps = await prisma.saaSApplication.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { licenses: true, recommendations: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

// Get single app
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;

    const app = await prisma.saaSApplication.findUnique({
      where: { id, organizationId: req.user!.organizationId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        licenses: true,
        usageMetrics: { orderBy: { month: 'desc' }, take: 12 },
        recommendations: { where: { status: 'pending' } },
      },
    });

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch app' });
  }
});

// Create app
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const data = req.body;

    const app = await prisma.saaSApplication.create({
      data: {
        ...data,
        organizationId: req.user!.organizationId,
        renewalDate: new Date(data.renewalDate),
        contractStartDate: new Date(data.contractStartDate),
        contractEndDate: new Date(data.contractEndDate),
      },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'CREATE_APP',
      'saas_app',
      app.id,
      { name: app.name, category: app.category },
      req.ip
    );

    res.status(201).json(app);
  } catch (error) {
    console.error('Create app error:', error);
    res.status(500).json({ error: 'Failed to create app' });
  }
});

// Update app
router.patch('/:id', authenticate, authorize('admin', 'app_owner'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;
    const data = req.body;

    // Convert date strings if present
    if (data.renewalDate) data.renewalDate = new Date(data.renewalDate);
    if (data.contractStartDate) data.contractStartDate = new Date(data.contractStartDate);
    if (data.contractEndDate) data.contractEndDate = new Date(data.contractEndDate);

    const app = await prisma.saaSApplication.update({
      where: { id, organizationId: req.user!.organizationId },
      data,
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'UPDATE_APP',
      'saas_app',
      id,
      data,
      req.ip
    );

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update app' });
  }
});

// Delete app
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;

    const app = await prisma.saaSApplication.delete({
      where: { id, organizationId: req.user!.organizationId },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'DELETE_APP',
      'saas_app',
      id,
      { name: app.name },
      req.ip
    );

    res.json({ message: 'App deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete app' });
  }
});

export default router;
