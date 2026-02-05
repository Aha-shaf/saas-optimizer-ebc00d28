import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest, createAuditLog } from '../middleware/auth.js';

const router = Router();

// Get licenses for an app
router.get('/app/:appId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { appId } = req.params;

    const licenses = await prisma.license.findMany({
      where: { saasAppId: appId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { userName: 'asc' },
    });

    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
});

// Get all unused licenses across organization
router.get('/unused', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const licenses = await prisma.license.findMany({
      where: {
        saasApp: { organizationId: req.user!.organizationId },
        OR: [
          { lastActiveDate: null },
          { lastActiveDate: { lt: thirtyDaysAgo } },
          { monthlyActiveDays: { lt: 5 } },
        ],
      },
      include: {
        saasApp: { select: { id: true, name: true, costPerLicense: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unused licenses' });
  }
});

// Create license
router.post('/', authenticate, authorize('admin', 'app_owner'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const data = req.body;

    const license = await prisma.license.create({
      data: {
        ...data,
        assignedDate: new Date(data.assignedDate || new Date()),
      },
    });

    // Update app's licensesUsed count
    await prisma.saaSApplication.update({
      where: { id: data.saasAppId },
      data: { licensesUsed: { increment: 1 } },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'ASSIGN_LICENSE',
      'license',
      license.id,
      { appId: data.saasAppId, userEmail: data.userEmail },
      req.ip
    );

    res.status(201).json(license);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create license' });
  }
});

// Revoke license
router.delete('/:id', authenticate, authorize('admin', 'app_owner'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;

    const license = await prisma.license.delete({
      where: { id },
    });

    // Update app's licensesUsed count
    await prisma.saaSApplication.update({
      where: { id: license.saasAppId },
      data: { licensesUsed: { decrement: 1 } },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'REVOKE_LICENSE',
      'license',
      id,
      { appId: license.saasAppId, userEmail: license.userEmail },
      req.ip
    );

    res.json({ message: 'License revoked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke license' });
  }
});

export default router;
