import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "next-auth/react"; // If using NextAuth.js

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  try {
    await connectDB(); 
    
    // Get user session (if using authentication)
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { userId, name, bio, skills, experience, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, skills, experience, location },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
