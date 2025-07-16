import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/app/lib/db";
import Job from "@/app/models/Job";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectDB();
    const { title, company, location, description, skillsRequired, postedBy } = req.body;

    const job = await Job.create({ title, company, location, description, skillsRequired, postedBy });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
