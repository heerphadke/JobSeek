import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/app/lib/db";
import User from "@/app/models/User";
import Job from "@/app/models/Job";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await connectDB();
    const { userId } = req.query;

    const user = await User.findById(userId).populate("likedJobs");
    const matches = await Job.find({ _id: { $in: user.likedJobs }, likedBy: userId });

    res.status(200).json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
