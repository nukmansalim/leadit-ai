import { Redis } from "ioredis";

export function createRedisConnection(): Redis {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is not defined");
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });
}

