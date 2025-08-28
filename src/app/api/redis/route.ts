// app/api/redis/route.ts
import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export const POST = async () => {
  try {
    const redis = await getRedisClient();
    
    // Fetch data from Redis
    const result = await redis.get('item');

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch from Redis' }, { status: 500 });
  }
};
