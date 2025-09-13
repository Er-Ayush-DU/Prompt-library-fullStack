/*
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

*/

import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const {pathname} =  req.nextUrl;
        // allow  auth related routes
        if(
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||  
          pathname === "/signup" 
        ) {
            return true;
        }

        // public routes
        if(
          pathname.startsWith("/prompts") ||
          pathname === "/" ||
          pathname === "/dashboard" ||
          pathname === "/about" ||
          pathname === "/contact" ||
          pathname === "/pricing" ||
          pathname === "/docs" ||
          pathname === "/terms" ||
          pathname === "/privacy" ||
          pathname === "/features"
        ){
          return true;
        }
         return !!token;                

      },
    },
  },
)

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] }




