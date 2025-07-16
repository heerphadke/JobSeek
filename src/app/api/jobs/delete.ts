import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/app/lib/db";
import Job from "@/app/models/Job";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  try {
    await connectDB();
    const { jobId } = req.body;

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
