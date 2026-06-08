import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    // Timing-safe password verification
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin";
    if (typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Unauthorized: Missing credentials" }, { status: 401 });
    }

    const expectedBuffer = Buffer.from(expectedPassword);
    const inputBuffer = Buffer.from(password);
    
    if (inputBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(inputBuffer, expectedBuffer)) {
      return NextResponse.json({ error: "Unauthorized: Invalid passphrase" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (maximum 10MB)" }, { status: 400 });
    }

    // Basic MIME type validation
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type: PDF required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Deep signature validation: check for PDF magic bytes (%PDF)
    if (buffer.length < 4 || buffer.toString("utf-8", 0, 4) !== "%PDF") {
      return NextResponse.json({ error: "Invalid file structure: Missing PDF signature" }, { status: 400 });
    }

    // Write to a fixed path (prevents path traversal attacks)
    const pdfPath = path.join(process.cwd(), "public/CV.pdf");
    await fs.writeFile(pdfPath, buffer);

    return NextResponse.json({ success: true, message: "CV uploaded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
  }
}
