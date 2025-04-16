import NextAuth from "next-auth"
import authConfig from "./app/(auth)/auth.config"
import { NextResponse } from "next/server";
 
const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = [
  "/",
  "/login", 
  "/join",     

  "/register",
  "/api/organizations/register",
  "/api/locations/id"
];

export default middleware((request) => {
  const {nextUrl, auth} = request;
  const isLoggedIn = !!auth?.user;      

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