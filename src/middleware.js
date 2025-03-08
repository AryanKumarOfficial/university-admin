import {NextResponse} from "next/server";
import {auth} from "@/lib/firebase/client";

const publicRoutes = ['/login', '/register'];
const assetRoutes = /^\/(_next\/static|assets)\//; // Allow Next.js static assets and custom assets

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    if (publicRoutes.includes(path) || assetRoutes.test(path)) {
        return NextResponse.next();
    }

    // Protect all other routes
    const session = request.cookies.get('firebase-auth-token')?.value;
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await auth.currentUser?.getIdToken(true);
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('firebase-auth-token');
        return response;
    }
}
