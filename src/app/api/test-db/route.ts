import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export async function GET(req: Request) {
  try {
    const user = await db.adminUser.findUnique({ where: { email: 'admin@vertexit.in' } });
    if (!user) return NextResponse.json({ error: "User not found" });
    const ok = verifyPassword("vertexit123", user.passwordHash);
    return NextResponse.json({ found: true, email: user.email, passwordMatch: ok });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack });
  }
}
