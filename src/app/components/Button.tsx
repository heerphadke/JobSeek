"use client";
interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="p-3 bg-blue-500 text-white rounded-lg">
      {text}
    </button>
  );
}
