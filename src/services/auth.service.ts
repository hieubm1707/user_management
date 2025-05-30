import { Unauthorized } from 'http-errors';
import { i18n as I18n } from 'i18next';
import { Inject, Service } from 'typedi';
import { userDTO } from '../dto';
import { UserModel } from '../models';
import { LoginRes } from '../types';

@Service()
export default class AuthService {
  @Inject('i18n')
  i18n!: I18n;

  /**
   * Authenticates a user and returns a JWT token.
   */
  async login(username: string, password: string): Promise<LoginRes> {
    // Check if a user with this email exists
    const user = await UserModel.findOne({
      attributes: {
        include: ['password'],
      },
      where: { username },
    });

    if (!user) {
      throw new Unauthorized(this.i18n.t('errors:invalidCredentials'));
    }

    // Check if passwords match
    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      throw new Unauthorized(this.i18n.t('errors:invalidCredentials'));
    }

    // Generate JWT
    const token = await user.generateJWT();

    return <LoginRes>{ token, user: userDTO(user) };
  }
}
