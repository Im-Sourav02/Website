import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ success: false, error: 'No token provided' }, { status: 400 });
        }

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${encodeURIComponent(process.env.TURNSTILE_SECRET_KEY || '')}&response=${encodeURIComponent(token)}`,
            cache: 'no-store'
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Verification failed',
                details: verifyData['error-codes']
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
