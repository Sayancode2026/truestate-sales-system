import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_URL,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

export async function getCachedFilterOptions() {
  try {
    const cached = await redis.get('filter_options');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

export async function setCachedFilterOptions(data) {
  try {
    await redis.setex('filter_options', 3600, JSON.stringify(data));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

export async function invalidateCache(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

export default redis;
