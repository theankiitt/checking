import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(
      `${baseUrl}/api/v1/configuration/public/navigation`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch navigation from backend");
    }

    const data = await response.json();
    const navData = data.data || [];

    return NextResponse.json({ success: true, data: navData });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch navigation",
        data: [],
      },
      { status: 500 },
    );
  }
}
