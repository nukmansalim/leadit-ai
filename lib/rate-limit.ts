import { createRedisConnection } from "./bullmq/connection";
import type { Redis } from "ioredis";

// ── Singleton Redis connection for rate limiting ─────────────────────
let _redis: Redis | null = null;

async function getRedis(): Promise<Redis> {
  if (!_redis) {
    _redis = createRedisConnection();
    await _redis.connect();
  }
  return _redis;
}

// ── In-memory fallback when Redis is unavailable ─────────────────────
const memoryCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit requests by an arbitrary key (IP, userId, etc.).
 * Defaults to 5 requests per 60 seconds.
 */
export async function rateLimit(
  key: string,
  limit = 5,
  duration = 60,
): Promise<{ success: boolean }> {
  try {
    const redis = await getRedis();
    const redisKey = `rate-limit:${key}`;
    const current = await redis.get(redisKey);

    if (current && parseInt(current, 10) >= limit) {
      return { success: false };
    }

    const tx = redis.multi();
    tx.incr(redisKey);
    tx.expire(redisKey, duration);
    await tx.exec();

    return { success: true };
  } catch {
    // Fallback to in-memory rate limiting
    const now = Date.now();
    const record = memoryCache.get(key);

    if (!record || now > record.resetTime) {
      memoryCache.set(key, {
        count: 1,
        resetTime: now + duration * 1000,
      });
      return { success: true };
    }

    if (record.count >= limit) {
      return { success: false };
    }

    record.count += 1;
    return { success: true };
  }
}
