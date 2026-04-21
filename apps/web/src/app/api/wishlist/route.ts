import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { wishlistSchema, validateData } from "@/lib/validations";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken || ""}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = validateData(wishlistSchema, body);

    const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any).accessToken || ""}`,
      },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Validation failed")) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to add to wishlist" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/wishlist/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session as any).accessToken || ""}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to remove from wishlist" },
      { status: 500 },
    );
  }
}
