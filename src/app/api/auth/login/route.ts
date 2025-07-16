// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is missing in environment variables");
  throw new Error("MONGODB_URI is missing in environment variables");
}

const client = new MongoClient(uri);

export async function POST(req: Request) {
  try {
    console.log("✅ API Hit: Login request received");

    await client.connect();
    const database = client.db("JobTinder");
    const collection = database.collection("users");

    let body;
    try {
      body = await req.json();
      console.log("📥 Received Data:", body);
    } catch (error) {
      console.error("❌ Error parsing JSON:", error);
      return NextResponse.json(
        { message: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;
    if (!email || !password) {
      console.error("❌ Missing email or password");
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await collection.findOne({ email });
    if (!user) {
      console.error("❌ User not found:", email);
      return NextResponse.json(
        { message: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      console.error("❌ Incorrect password for:", email);
      return NextResponse.json(
        { message: "Incorrect credentials. Please try again." },
        { status: 401 }
      );
    }

    console.log("✅ Login successful for:", email);
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
