import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/app/lib/db";
import Job from "@/app/models/Job";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    await connectDB();
    const { skills } = req.query;

    const jobs = await Job.find({ skillsRequired: { $in: skills } });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
