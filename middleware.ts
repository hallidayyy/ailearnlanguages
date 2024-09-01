import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ["/", "/pricing","/readme","/readme.html", "/api/get-user-info"],

  afterAuth(auth, req, evt) {
    // 检查请求是否为 Stripe Webhook 请求
    if (req.nextUrl.pathname.startsWith('/api/webhook')) {
      console.log("strip webhook")
      return NextResponse.next();
    }

    if (!auth.userId && !auth.isPublicRoute) {
      if (auth.isApiRoute) {
        return NextResponse.json(
          { code: -2, message: "no auth" },
          { status: 401 }
        );
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};