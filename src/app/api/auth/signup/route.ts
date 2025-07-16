import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongodb";

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Received signup request:", { ...body, password: body.password ? "[HIDDEN]" : null });

    const { name, email, image, provider, providerId, password } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (provider === "credentials" && !password) {
      return NextResponse.json(
        { error: "Password is required for credentials signup" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    try {
      await connectDB();
      console.log("Successfully connected to MongoDB");
    } catch (mongoError) {
      console.error("MongoDB connection error:", mongoError);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("Existing user check:", existingUser ? "User exists" : "No existing user");

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      image: image || null,
      provider,
      providerId: providerId || null,
      password: provider === "credentials" ? await hash(password, 10) : null,
    });

    console.log("Creating new user:", { ...newUser.toObject(), password: "[HIDDEN]" });

    await newUser.save();

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error details:", error);
    // Return more specific error message based on error type
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error creating user: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
