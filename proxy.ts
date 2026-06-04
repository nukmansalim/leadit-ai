import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthPage = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");
    const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

    if (!isLoggedIn && isDashboardPage) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
    }

    return;
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};