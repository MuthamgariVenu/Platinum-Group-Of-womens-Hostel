import { NextResponse } from 'next/server';

// ⚠️ Change these credentials before deploying
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'platinum@2024';
const SESSION_TOKEN = 'pt_admin_2024_secure';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', SESSION_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
