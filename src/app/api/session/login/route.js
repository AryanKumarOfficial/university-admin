// app/api/session/login/route.ts
import {adminAuth} from '@/lib/firebase/admin';
import {cookies} from 'next/headers';

export async function POST(request) {
    const {idToken} = await request.json();

    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {expiresIn});

        (await cookies()).set('__session', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expiresIn,
            path: '/',
        });

        return Response.json({status: 'success'});
    } catch (error) {
        return Response.json({status: 'error', message: error}, {status: 401});
    }
}