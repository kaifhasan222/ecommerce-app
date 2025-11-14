import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid cart payload' }, { status: 400 });
    }

    const success = Math.random() > 0.15;
    if (!success) {
      return NextResponse.json({ ok: false, message: 'Payment gateway error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, orderId: `ORD-${Date.now()}` });
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
