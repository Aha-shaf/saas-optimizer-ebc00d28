import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, authorize, AuthRequest, createAuditLog } from '../middleware/auth.js';

const router = Router();

// Get all users in organization
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    
    const users = await prisma.user.findMany({
      where: { organizationId: req.user!.organizationId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user (admin only)
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { email, password, name, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'app_owner',
        organizationId: req.user!.organizationId,
      },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'CREATE_USER',
      'user',
      user.id,
      { email, name, role },
      req.ip
    );

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.patch('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;
    const { name, role } = req.body;

    const user = await prisma.user.update({
      where: { id, organizationId: req.user!.organizationId },
      data: { name, role },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'UPDATE_USER',
      'user',
      id,
      { name, role },
      req.ip
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma: PrismaClient = req.app.get('prisma');
    const { id } = req.params;

    await prisma.user.delete({
      where: { id, organizationId: req.user!.organizationId },
    });

    await createAuditLog(
      prisma,
      req.user!.id,
      req.user!.email,
      'DELETE_USER',
      'user',
      id,
      {},
      req.ip
    );

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
