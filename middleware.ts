import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL("/sign-in", req.url));
    }

    // If the user is logged in but trying to access a protected route, let them through
    if (auth.userId && !auth.isPublicRoute) {
      return;
    }
  },
  // Add debug logging
  debug: process.env.NODE_ENV === 'development',
  // Ensure proper session handling
  sessionToken: true,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
