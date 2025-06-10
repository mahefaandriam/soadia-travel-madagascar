import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Define protected routes
  const protectedRoutes = ["/profile"]
  const adminRoutes = ["/admin"]

  // Check if the current path is in the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If it's a protected route and the user is not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If it's an admin route, check for admin privileges
  if (isAdminRoute) {
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Check if user is admin
    if (token.email !== "admin@soatransplus.com") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // If the user is already authenticated and tries to access login/register, redirect to profile
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/login", "/register"],
}
