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
  DeleteUserResponseDTO,
  AuthUser
} from '../types';
import { userFilterSchema } from '../middlewares/validation.middleware';
import { NotFound } from 'http-errors';
import { checkPermission } from '../middlewares/permission.middleware';
import { Response } from 'express';
import { mapUserAuthToDTO } from '../dto/user.dto';


const router = Router();


/**
 * GET /users/filter
 *
 * Get users list by filtering
 */
router.get<{}, UsersResponseDTO, {}, FilterUserDTO>(
  '/filter',
  checkPermission(),
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
  checkPermission(),
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
router.get<{}, User>(
  '/me',
  checkPermission(),
  async (req, res) => {
    const userService = Container.get(UserService);
    const user = userService.getOwnUserData(req.auth as AuthUser);
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
    return res.status(200).json(user);
  },
);
  

/**
 * PUT /users/:userId
 *
 * Update user info
 */
router.put<{ userId: string }, User, Partial<CreateUserDTO>>(
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
    const updatedUser = await Container.get(UserService).updateUser(
      req.params.userId, 
      req.body
    );
    res.status(200).json(updatedUser);
  }
);


/**
 * DELETE /users/:userId
 *
 * Delete user
 */
router.delete<{ userId: string }, string>(
  '/:userId',
  checkPermission(),
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    await Container.get(UserService).deleteUser(req.params.userId);
    res.status(200).json('User deleted successfully');
  },
);


export default router;

