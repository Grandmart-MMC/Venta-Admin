import { NextResponse } from "next/server";

export async function GET() {
  // Test amaçlı 401 hatası döndür
  return NextResponse.json(
    { message: "Unauthorized - Token expired" },
    { status: 401 }
  );
} 