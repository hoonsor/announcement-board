import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/create');

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
