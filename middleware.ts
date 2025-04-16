import NextAuth from "next-auth"
import authConfig from "./app/(auth)/auth.config"
import { NextResponse } from "next/server";
 
const { auth: middleware } = NextAuth(authConfig);

const USER = process.env.BASIC_AUTH_USER;
const PASS = process.env.BASIC_AUTH_PASS;

const publicRoutes = [
  "/",
  "/login",
  "/register",  
  "/api/auth/verify-email",
  "/home",
];

export default middleware((request) => {
  const {nextUrl, auth} = request;
  const isLoggedIn = !!auth?.user;
  
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
      return new NextResponse('No autorizado', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Protegido"' },
      });
  }

  const [user, pass] = atob(authHeader.split(' ')[1]).split(':');
  if (user !== USER || pass !== PASS) {
      return new NextResponse('No autorizado', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Protegido"' },
      });
  }

  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  };