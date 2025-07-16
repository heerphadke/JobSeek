import { connectDB } from "../src/app/lib/db";
import Job from "../src/app/models/Job";  

async function seed() {
  await connectDB();

  await Job.create([
    { title: "Software Engineer", company: "Google", location: "Remote" },
    { title: "Frontend Developer", company: "Meta", location: "NY, USA" },
  ]);

  console.log("✅ Database seeded!");
  process.exit();
}

seed();
