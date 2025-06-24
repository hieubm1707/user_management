/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createClient, RedisClientType } from 'redis';
import { Container } from 'typedi';
import { Config } from '../config';

/**
 * Redis client initializer
 */
export default async function initRedis(): Promise<RedisClientType> {
  const config = Container.get<Config>('config');

  // Create Redis client
  const redisClient: RedisClientType = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
  });

  redisClient.on('error', err => {
    throw new Error(`failed to initialize redis client. ${err}`);
  });

  await redisClient.connect();

  return redisClient;
}
