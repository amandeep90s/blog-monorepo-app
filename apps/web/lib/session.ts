import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";

export type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  bio?: string | null;
};

export type Session = {
  user: SessionUser;
  accessToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY;

if (!secretKey) {
  throw new Error("SESSION_SECRET_KEY environment variable is not set");
}

const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Creates a session cookie with the given payload.
 * @param payload
 */
export async function createSession(payload: Session) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expireAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSession() {
  (await cookies()).delete("session");
}

/**
 * Retrieves and verifies the session from the cookie.
 */
export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (error) {
    console.error("Failed to verify the session:", error);

    redirect("/sign-in");
  }
}
