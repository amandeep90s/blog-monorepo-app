import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { BACKEND_URL } from "@/constants/app";

import { createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get("accessToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const avatar = searchParams.get("avatar");

  if (!accessToken || !userId || !name) {
    throw new Error("Google oauth failed");
  }

  const res = await fetch(`${BACKEND_URL}/auth/verify-token`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) throw new Error("Invalid access token");

  await createSession({
    user: {
      id: userId,
      name,
      avatar: avatar && avatar !== "null" ? avatar : undefined,
    },
    accessToken,
  });

  redirect("/");
}
