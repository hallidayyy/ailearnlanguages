import { getUserQuota } from "@/models/quota";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userEmail = url.searchParams.get('user_email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Missing user_email query parameter' }, { status: 400 });
  }

  try {
    const quota = await getUserQuota(userEmail);
    if (quota) {
      return NextResponse.json(quota);
    } else {
      return NextResponse.json({ error: 'User quota not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}