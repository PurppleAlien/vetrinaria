import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {};
  let allOk = true;

  // App check
  checks.app = 'ok';

  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      checks,
    },
    { status: 200 },
  );
}
