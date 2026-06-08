import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const dbPath = path.join(process.cwd(), "src/data/db.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(dbPath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to read database: " + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Timing-safe passphrase verification
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin";
    if (typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Unauthorized: Missing credentials" }, { status: 401 });
    }

    const expectedBuffer = Buffer.from(expectedPassword);
    const inputBuffer = Buffer.from(password);
    
    if (inputBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(inputBuffer, expectedBuffer)) {
      return NextResponse.json({ error: "Unauthorized: Invalid passphrase" }, { status: 401 });
    }

    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    // Write back to db.json
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update database: " + error.message }, { status: 500 });
  }
}
