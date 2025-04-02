import {NextResponse} from "next/server";
import {jwtVerify} from "jose";

// Public routes do not require authentication.
const publicRoutes = ["/login"];

export async function middleware(request) {
    const {pathname} = request.nextUrl;
    const token = request.cookies.get("firebase-auth-token")?.value;

    // Handle public routes.
    if (publicRoutes.includes(pathname)) {
        // If a token exists, the user is already authenticated, so redirect to home.
        if (token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // For protected routes, if no token, redirect to login.
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        // Decode the token.
        // In production, replace this with jwt.verify(token, YOUR_PUBLIC_KEY) to ensure authenticity.
        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

        const {payload: decoded} = await jwtVerify(token, secretKey, {
            algorithms: ["HS256"],
        });

        if (!decoded) {
            throw new Error("Invalid token");
        }
        const userRole = decoded.payload.role; // Assumes the token includes a 'role' claim.

        // Admin users have full access.
        if (userRole === "Admin") {
            return NextResponse.next();
        }

        // For Growth Managers:
        // - They can access any /training route EXCEPT /training/locations.
        // - For "school" routes (at root level), only allow specific paths.
        if (userRole === "Growth Manager") {
            const allowedSchoolPaths = ["/", "/leads", "/clients"];
            if (pathname.startsWith("/training")) {
                if (pathname === "/training/locations") {
                    const referer = request.headers.get("referer");
                    let redirectUrl = new URL("/training", request.url);
                    if (referer) {
                        const refererUrl = new URL(referer);
                        if (refererUrl.hostname === request.nextUrl.hostname) {
                            redirectUrl = refererUrl;
                        }
                    }
                    return NextResponse.redirect(redirectUrl);
                }
                return NextResponse.next();
            }
            // Allow if pathname exactly matches or is a child of an allowed path.
            if (allowedSchoolPaths.some(
                (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`)
            )) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (userRole === "Trainee" || userRole === "Intern") {
            if (pathname === "/training") {
                return NextResponse.next();
            }
            // Otherwise, redirect to the /training route.
            return NextResponse.redirect(new URL("/training", request.url));
        }

        if (userRole === "Course Manager" || userRole === "Professional") {
            const allowedSchoolPaths = ["/training", "/training/trainee"];
            if (allowedSchoolPaths.includes(pathname)) {
                return NextResponse.next();
            }
            // Otherwise, redirect to the /training route.
            return NextResponse.redirect(new URL("/training", request.url));
        }

        // For other roles, allow access.
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        // If an error occurs, delete the token and redirect to login.
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("firebase-auth-token");
        return response;
    }
}

// The matcher excludes asset routes and API routes.
// For more info, see: https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
