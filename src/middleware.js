import {NextResponse} from "next/server";
import {auth} from "@/lib/firebase/client";

const publicRoutes = ["/login", "/register"];

export async function middleware(request) {
    const {pathname} = request.nextUrl;
    // Retrieve the session token once
    const session = request.cookies.get("firebase-auth-token")?.value;

    // If the route is public (auth routes)
    if (publicRoutes.includes(pathname)) {
        // If the user is already authenticated, redirect to home.
        if (session) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        // Otherwise, allow access to the auth route.
        return NextResponse.next();
    }

    // For protected routes, if there's no session, redirect to login.
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Validate the session by checking the Firebase token.
    try {
        await auth.currentUser?.getIdToken(true);
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("firebase-auth-token");
        return response;
    }
}

// Use route matcher to exclude asset routes
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
