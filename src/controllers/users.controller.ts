import Router from 'express-promise-router';
import { Container } from 'typedi';
import { validation } from '../middlewares';
import { UserService } from '../services';
import { CreateUserDTO, FilterUserDTO, User } from '../types';

const router = Router();

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
router.post<{}, User, CreateUserDTO>(
  '/',
  validation.celebrate({
    body: validation.Joi.object({
      firstName: validation.schemas.firstName.required(),
      lastName: validation.schemas.lastName.required(),
      password: validation.schemas.password.required(),
      username: validation.schemas.username.required(),
      email: validation.schemas.email,
      phone: validation.schemas.phone,
    }).required(),
  }),
  async (req, res) => {
    const userDetails = req.body;

    const user = await Container.get(UserService).createUser(userDetails);

    res.status(201).json(user);
  },
);

/**
 * GET /users
 *
 * Get users list by filtering
 */
router.get<{}, User[], {}, FilterUserDTO>('/', async (req, res) => {
  const filter = req.query;

  const users = await Container.get(UserService).getUsers(filter);

  res.status(200).json(users);
});

export default router;
