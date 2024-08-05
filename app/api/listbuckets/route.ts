import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export async function GET(req: Request) {
  try {
    const [buckets] = await storage.getBuckets();
    const bucketNames = buckets.map(bucket => bucket.name);
    return NextResponse.json({ buckets: bucketNames });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || error }, { status: 500 });
  }
}