import { NextResponse } from "next/server";
import { insertContactMessage } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Check presence
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Input sanitization / validation to prevent database exhaustion
    if (typeof name !== "string" || name.trim().length > 100) {
      return NextResponse.json({ error: "Invalid name (maximum 100 characters)" }, { status: 400 });
    }

    if (typeof email !== "string" || email.trim().length > 100) {
      return NextResponse.json({ error: "Invalid email (maximum 100 characters)" }, { status: 400 });
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    if (typeof message !== "string" || message.trim().length > 3000) {
      return NextResponse.json({ error: "Invalid message (maximum 3000 characters)" }, { status: 400 });
    }

    const inserted = await insertContactMessage({ 
      name: name.trim(), 
      email: email.trim().toLowerCase(), 
      message: message.trim() 
    });

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
