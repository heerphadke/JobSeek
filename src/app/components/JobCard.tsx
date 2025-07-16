"use client";
import React from "react";

type JobProps = {
  title: string;
  company: string;
  location: string;
  salary?: string;
};

const JobCard: React.FC<JobProps> = ({ title, company, location, salary }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-600">{company} - {location}</p>
      {salary && <p className="text-green-500 font-semibold">Salary: {salary}</p>}
    </div>
  );
};

export default JobCard;
