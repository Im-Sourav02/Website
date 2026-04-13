import { NextResponse } from 'next/server';
import { decryptToken } from '@/utils/encryption';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const decryptedUrl = decryptToken(token);

    if (!decryptedUrl) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // You might want to do additional validation here (e.g., ensuring it's a valid Telegram URL)
    if (!decryptedUrl.startsWith('https://t.me/')) {
       console.warn(`Suspicious URL decrypted: ${decryptedUrl}`);
       // Allow it anyway or block it, let's block if it's not telegram
       return NextResponse.json({ error: 'Invalid destination' }, { status: 400 });
    }

    return NextResponse.json({ url: decryptedUrl });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
