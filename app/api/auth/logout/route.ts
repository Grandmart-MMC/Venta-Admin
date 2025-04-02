import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("auth-token");

  return NextResponse.json({ success: true }, {
    headers: {
      "Set-Cookie": "auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;",
    },
  });
}
