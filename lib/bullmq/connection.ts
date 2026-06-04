import IORedis from "ioredis";

export function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is not defined");
  }

  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });
}
