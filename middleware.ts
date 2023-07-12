import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});

// all routes that start with / or /api are protected
// The authMiddleware middleware will check if the current user is logged
// in before allowing them to access any of these routes. If the user is not
// logged in, they will be redirected to the Clerk login page.
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
