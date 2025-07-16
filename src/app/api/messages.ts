import { NextApiRequest, NextApiResponse } from "next";
import {connectDB} from "@/app/lib/db";
import Message from "@/app/models/Message";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectDB();
    const { sender, receiver, text } = req.body;

    const message = await Message.create({ sender, receiver, text });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
