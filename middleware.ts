import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "@/middlewares/api/authMiddleware";
import { logMiddleware } from "@/middlewares/api/logMiddleware";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(request: NextRequest) {
  const authResult = authMiddleware(request);
  if (request.url.includes("/api/blog")) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }

  if (!authResult?.isValid) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}
