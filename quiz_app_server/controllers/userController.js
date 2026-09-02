const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { asyncHandler, NotFoundError } = require('../middleware/errorHandler');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { attempts: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const result = await Promise.all(users.map(async (user) => {
    const completedAttempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, completedAt: { not: null } },
      select: { score: true }
    });
    const avgScore = completedAttempts.length > 0
      ? Math.round(completedAttempts.reduce((s, a) => s + (a.score || 0), 0) / completedAttempts.length)
      : 0;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      quizzesTaken: user._count.attempts,
      averageScore: avgScore,
      status: 'active'
    };
  }));

  res.json({ success: true, data: result });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    select: {
      id: true, name: true, email: true, role: true,
      createdAt: true, updatedAt: true,
      attempts: {
        include: { quiz: { select: { title: true } } },
        orderBy: { startedAt: 'desc' },
        take: 10
      }
    }
  });
  if (!user) throw new NotFoundError('User not found');
  res.json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;
  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (role) data.role = role;
  if (password) data.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    select: { id: true, name: true, email: true, role: true }
  , data });

  res.json({ success: true, message: 'User updated', data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
  }

  await prisma.answer.deleteMany({ where: { attempt: { userId: id } } });
  await prisma.quizAttempt.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  res.json({ success: true, message: 'User deleted' });
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
