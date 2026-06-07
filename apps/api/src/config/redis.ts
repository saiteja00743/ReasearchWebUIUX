import { Redis } from "ioredis";

export const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export async function cacheJson<T>(key: string, ttlSeconds: number, resolver: () => Promise<T>): Promise<T> {
  if (!redis) return resolver();
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;
  const value = await resolver();
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  return value;
}
