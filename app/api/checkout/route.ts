import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface CartItem {
  [key: string]: unknown;
}

interface CartPayload {
  items: CartItem[];
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  ok: true;
  orderId: string;
}

interface FailureResponse {
  ok: false;
  message: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<ErrorResponse | SuccessResponse | FailureResponse>> {
  try {
    const body: CartPayload = await req.json();
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
