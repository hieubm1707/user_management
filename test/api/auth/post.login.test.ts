import jwt from 'jsonwebtoken';
import { CreationAttributes } from 'sequelize';
import { Container } from 'typedi';
import { Config } from '../../../src/config';
import { UserModel } from '../../../src/models';
import { UserRoleEnum } from '../../../src/types/enums';
import { agent } from '../../jest.setup';
import { cleanDatabase } from '../../utils';

/**
 * POST /auth/login
 */
describe('POST /auth/login', () => {
  let user: UserModel;

  beforeAll(async () => {
    await cleanDatabase();
    const userDetail = {
      firstName: 'test',
      lastName: '',
      username: 'test0001',
      email: 'test@gmail.com',
      password: 'p4ssW0rd',
      role: UserRoleEnum.User,
    };
    user = await UserModel.create(userDetail as CreationAttributes<UserModel>);
  });

  it('should return 200 on user login', async () => {
    const config = Container.get<Config>('config');

    const requestData = {
      username: 'test0001',
      password: 'p4ssW0rd',
    };

    const res = await agent
      .post('/auth/login')
      .accept('json')
      .type('json')
      .send(requestData)
      .expect(200);

    expect(res.body).toStrictEqual({
      token: expect.any(String),
    });

    const decodedToken = jwt.decode(res.body.token, { json: true }) as { [key: string]: any };

    expect(decodedToken).toStrictEqual({
      email: 'john.doe@gmail.com',
      iat: expect.any(Number),
      iss: config.publicHost,
      jti: expect.any(String),
      name: 'John Doe',
      role: UserRoleEnum.User,
      sub: user.id,
    });
  });

  it('should return 400 on missing email field', async () => {
    const requestData = { password: 'p4ssW0rd' };

    await agent.post('/auth/login').accept('json').type('json').send(requestData).expect(400);
  });

  it('should return 400 on missing password field', async () => {
    const requestData = { email: 'john.doe@gmail.com' };

    await agent.post('/auth/login').accept('json').type('json').send(requestData).expect(400);
  });

  it('should return 401 on incorrect email', async () => {
    const requestData = {
      username: 'test0002',
      password: 'p4ssW0rd',
    };

    await agent.post('/auth/login').accept('json').type('json').send(requestData).expect(401);
  });

  it('should return 401 on incorrect password', async () => {
    const requestData = {
      username: 'test0001',
      password: 'wrong_password',
    };

    await agent.post('/auth/login').accept('json').type('json').send(requestData).expect(401);
  });
});
