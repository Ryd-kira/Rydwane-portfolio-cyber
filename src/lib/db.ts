import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: Date;
}

// In-memory fallback database for local testing when Neon is not connected
const mockDatabase: ContactMessage[] = [];

export async function insertContactMessage(data: ContactMessage) {
  if (!databaseUrl) {
    console.warn("⚠️ DATABASE_URL is not set. Saving message to in-memory fallback store.");
    const newMessage = {
      ...data,
      id: mockDatabase.length + 1,
      created_at: new Date()
    };
    mockDatabase.push(newMessage);
    console.log("📁 Mock DB Store:", mockDatabase);
    return newMessage;
  }

  try {
    const sql = neon(databaseUrl);
    
    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    const result = await sql`
      INSERT INTO contacts (name, email, message)
      VALUES (${data.name}, ${data.email}, ${data.message})
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
}

export async function getContactMessages() {
  if (!databaseUrl) {
    return mockDatabase;
  }
  try {
    const sql = neon(databaseUrl);
    return await sql`SELECT * FROM contacts ORDER BY created_at DESC;`;
  } catch (error) {
    console.error("❌ Database read error:", error);
    return mockDatabase;
  }
}
