import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log("\n" + "=".repeat(50));
    console.log("📥 INCOMING GENERATOR PAYLOAD (SERVER LOG)");
    console.log("=".repeat(50));
    console.log(JSON.stringify(payload, null, 2));
    console.log("=".repeat(50) + "\n");

    return NextResponse.json({ success: true, message: "Payload logged to server console" });
  } catch (error) {
    console.error("Failed to log payload:", error);
    return NextResponse.json({ success: false, error: "Failed to parse payload" }, { status: 400 });
  }
}
