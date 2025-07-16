import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/app/lib/db";
import Job from "@/app/models/Job";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  try {
    await connectDB();

    // Extract filters from query params
    const { location, skills, company } = req.query;

    const filter: any = {};
    if (location) filter.location = location;
    if (company) filter.company = { $regex: company, $options: "i" }; // Case-insensitive search

    // Fix: Ensure `skills` is always an array before using `$in`
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : skills.split(",");
      filter.skills = { $in: skillArray };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 }); // Latest jobs first

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
