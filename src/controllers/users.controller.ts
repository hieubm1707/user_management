import Router from 'express-promise-router';
import { Container } from 'typedi';
import { validation } from '../middlewares';
import { UserService } from '../services';
import { 
  CreateUserDTO, 
  FilterUserDTO, 
  User, 
  UserResponseDTO, 
  UsersResponseDTO, 
  UpdateUserResponseDTO,
  DeleteUserResponseDTO 
} from '../types';
import { userFilterSchema } from '../middlewares/validation.middleware';
import { NotFound } from 'http-errors';

import { Response } from 'express';

const router = Router();

/**
 * GET /users/filter
 *
 * Get users list by filtering
 */
router.get<{}, UsersResponseDTO, {}, FilterUserDTO>(
  '/filter',
  validation.celebrate({
    query: userFilterSchema,
  }),
  async (req, res) => {
    const filter = req.query;
    const users = await Container.get(UserService).getUsers(filter);
    
    res.status(200).json({
      success: true,
      data: users,
      total: users.length,
      message: users.length > 0 ? 'Users found successfully' : 'No users found'
    });
  },
);

/**
 * GET /
 *
 * Get all users
 */
router.get<{}, UsersResponseDTO>(
  '/',
  async (req, res) => {
    const users = await Container.get(UserService).getUsers({});
    
    res.status(200).json({
      success: true,
      data: users,
      total: users.length,
      message: 'All users retrieved successfully'
    });
  },
);


/**
 * GET /me
 *
 * Get owns user details
 */
router.get(
  '/me',
  async (req, res) => {
    const user = req.auth;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
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
router.post<{}, UserResponseDTO, CreateUserDTO>(
  '/',
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


    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });

  },
);

/**
 * PUT /users/:userId
 *
 * Update user info
 */
router.put<{ userId: string }, UpdateUserResponseDTO, Partial<CreateUserDTO>>(
  '/:userId',
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
    
    // The service will throw a NotFound error if the user does not exist
    const updatedUser = await userService.updateUser(userId, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  }

);

/**
 * DELETE /users/:userId
 *
 * Delete user
 */
router.delete<{ userId: string }, DeleteUserResponseDTO>(
  '/:userId',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {

    const { userId } = req.params;
    
    // The service will throw a NotFound error if the user does not exist
    await Container.get(UserService).deleteUser(userId);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  },
);

export default router;

