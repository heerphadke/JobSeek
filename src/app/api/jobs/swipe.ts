import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/app/lib/db";
import User from "@/app/models/User";
import Job from "@/app/models/Job";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectDB();
    const { userId, jobId, action } = req.body;

    if (action === "like") {
      await User.findByIdAndUpdate(userId, { $addToSet: { likedJobs: jobId } });
      await Job.findByIdAndUpdate(jobId, { $addToSet: { likedBy: userId } });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
}
