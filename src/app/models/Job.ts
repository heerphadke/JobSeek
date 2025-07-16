"use client";
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  skillsRequired: [String],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
