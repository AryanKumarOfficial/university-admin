// app/api/csrf/route.ts
import {NextResponse} from 'next/server';
import {createTokens} from '@/lib/auth/csrf';

export async function GET() {
    const {csrfToken, cookie} = await createTokens();
    const response = NextResponse.json({csrfToken});
    response.headers.set('Set-Cookie', cookie);
    return response;
}