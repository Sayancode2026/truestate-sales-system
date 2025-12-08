import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();


const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false, 
  lazyConnect: true,  
  enableReadyCheck: true,
  keepAlive: 30000,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', (err) => console.error('Redis error:', err.message));
redis.on('close', () => console.log('Redis connection closed'));

export async function getCachedFilterOptions() {
  try {
    
    if (redis.status !== 'ready' && redis.status !== 'connect') {
      console.warn('Redis not ready, skipping cache read');
      return null;
    }
    
    const cached = await redis.get('filter_options');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache read error:', error.message);
    return null;
  }
}

export async function setCachedFilterOptions(data) {
  try {
    
    if (redis.status !== 'ready' && redis.status !== 'connect') {
      console.warn('Redis not ready, skipping cache write');
      return;
    }
    
    await redis.setex('filter_options', 3600, JSON.stringify(data));
  } catch (error) {
    console.error('Cache write error:', error.message);
  }
}

export async function invalidateCache(key) {
  try {
    
    if (redis.status !== 'ready' && redis.status !== 'connect') {
      console.warn('Redis not ready, skipping cache invalidation');
      return;
    }
    
    await redis.del(key);
  } catch (error) {
    console.error('Cache invalidation error:', error.message);
  }
}

export default redis;
