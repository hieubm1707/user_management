import { randomBytes } from 'crypto';
import { CreationAttributes } from 'sequelize';
import { UserModel } from '../../../src/models';
import { UserRoleEnum } from '../../../src/types/enums';
import { agent } from '../../jest.setup';
import { cleanDatabase } from '../../utils';

/**
 * GET /users/:userId
 */
describe('GET /users/:userId', () => {
  let user: UserModel;
  let token: string;

  beforeAll(async () => {
    await cleanDatabase();
    const userDetail = {
      firstName: 'test',
      lastName: '',
      email: 'test@gmail.com',
      password: 'p4ssW0rd',
      role: UserRoleEnum.User,
    };
    user = await UserModel.create(userDetail as CreationAttributes<UserModel>);
    token = await user.generateJWT();
  });

  it('should return 200 and the details of the user', async () => {
    const userId = user.id;

    const res = await agent
      .get(`/users/${userId}`)
      .accept('json')
      .auth(token, { type: 'bearer' })
      .type('json')
      .expect(200);

    expect(res.body).toStrictEqual({
      id: expect.any(String),
      fullName: 'test ',
      email: 'test@gmail.com',
      createdAt: expect.any(String),
    });
  });

  it('should return 404 on user not found', async () => {
    const userId = randomBytes(16).toString('hex');

    await agent
      .get(`/users/${userId}`)
      .accept('json')
      .auth(token, { type: 'bearer' })
      .type('json')
      .expect(404);
  });

  it('should return 401 on user not authenticated', async () => {
    const userId = user.id;

    await user.destroy();

    await agent.get(`/users/${userId}`).accept('json').type('json').expect(401);
  });
});
