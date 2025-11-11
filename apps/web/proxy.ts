import { NextResponse, type NextRequest } from "next/server";

import { getSession } from "./lib/session";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/user/:path*",
};
