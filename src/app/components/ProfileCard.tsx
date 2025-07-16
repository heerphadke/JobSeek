import React from "react";

type ProfileProps = {
  name: string;
  role: string;
  image: string;
};

const ProfileCard: React.FC<ProfileProps> = ({ name, role, image }) => {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white">
      <img src={image} alt={name} className="w-12 h-12 rounded-full" />
      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
