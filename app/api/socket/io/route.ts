import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return new Response('Socket.IO endpoint', { status: 200 });
}

export async function POST(req: NextRequest) {
  return new Response('Socket.IO endpoint', { status: 200 });
}