import Router from 'express-promise-router';
import { Container } from 'typedi';
import { validation } from '../middlewares';
import { AuthService } from '../services';
import { LoginDTO, LoginRes } from '../types';

const router = Router();

/**
 * POST /auth/login
 *
 * Authenticate user
 */
router.post<{}, LoginRes, LoginDTO>(
  '/login',
  validation.celebrate({
    body: {
      email: validation.schemas.email.required(),
      password: validation.schemas.password.required(),
    },
  }),
  async (req, res) => {
    const { email, password } = req.body;

    const loginData = await Container.get(AuthService).login(email, password);

    res.status(200).json({ token: loginData.token, user: loginData.user });
  },
);

export default router;
