import Router from 'express-promise-router';
import { Container } from 'typedi';
import { validation } from '../middlewares';
import { UserService } from '../services';
import { CreateUserDTO, FilterUserDTO, User } from '../types';
import { userFilterSchema } from '../middlewares/validation.middleware';
import { NotFound } from 'http-errors';
import { checkPermission } from '../middlewares/permission.middleware';
import { Response } from 'express';

const router = Router();

/**
 * GET /users/filter
 *
 * Get users list by filtering
 */
router.get<{}, any, {}, FilterUserDTO>(
  '/filter',
  checkPermission(),
  validation.celebrate({
    query: userFilterSchema,
  }),
  async (req, res) => {
    const filter = req.query;
    const users = await Container.get(UserService).getUsers(filter);
    if (!users || users.length === 0) {
      res.status(404).json({ message: 'No matching results found' });
      return;
    }
    res.status(200).json(users);
  },
);

/**
 * GET /
 *
 * Get all users
 */
router.get<{}, any>(
  '/',
  checkPermission(),
  async (req, res) => {
    const users = await Container.get(UserService).getUsers({});
    res.status(200).json(users);
  },
);

/**
 * GET /me
 *
 * Get owns user details
 */
router.get(
  '/me',
  checkPermission(),
  async (req, res) => {
    const user = req.auth;
    if (!user) return res.status(401).json({ message: 'Chưa đăng nhập!' });
    return res.status(200).json(user);
  },
);

/**
 * GET /users/:userId
 *
 * Get user details
 */
router.get<{ userId: string }, User>(
  '/:userId',
  checkPermission(),
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    const { userId } = req.params;
    const user = await Container.get(UserService).getUserById(userId);
    res.status(200).json(user);
  },
);

/**
 * POST /users
 *
 * Create new user
 */
router.post<{}, User, CreateUserDTO>(
  '/',
  checkPermission(),
  validation.celebrate({
    body: validation.Joi.object({
      firstName: validation.schemas.firstName.required(),
      lastName: validation.schemas.lastName.required(),
      password: validation.schemas.password.required(),
      username: validation.schemas.username.required(),
      email: validation.schemas.email,
      phone: validation.schemas.phone,
      positionId: validation.schemas.positionId,
    }).required(),
  }),
  async (req, res) => {
    const userDetails = req.body;
    const user = await Container.get(UserService).createUser(userDetails);
    res.status(201).json(user);
  },
);

/**
 * PUT /users/:userId
 *
 * Update user info
 */
router.put<{ userId: string }, any, Partial<CreateUserDTO>>(
  '/:userId',
  checkPermission(),
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
    body: validation.Joi.object({
      firstName: validation.schemas.firstName.optional(),
      lastName: validation.schemas.lastName.optional(),
      password: validation.schemas.password.optional(),
      username: validation.schemas.username.optional(),
      email: validation.schemas.email.optional(),
      phone: validation.schemas.phone.optional(),
      positionId: validation.schemas.positionId.optional(),
    }).min(1),
  }),
  async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    const userService = Container.get(UserService);
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUser = await userService.updateUser(userId, updateData);
    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  },
);

/**
 * DELETE /users/:userId
 *
 * Delete user
 */
router.delete<{ userId: string }, any>(
  '/:userId',
  checkPermission(),
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await Container.get(UserService).getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await Container.get(UserService).deleteUser(userId);
      // Trả về message thay vì 204
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  },
);

export default router;