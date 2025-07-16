"use client"; // Only for Next.js App Router

import { Typewriter } from "react-simple-typewriter";

export default function TypingText() {
  return (
    <h1 className="text-4xl font-bold text-center mt-10">
      Welcome to{" "}
      <span className="text-blue-500">
        <Typewriter
          words={["JobSeek"]}
          loop={true} // Infinite loop
          cursor
          cursorStyle="_"
          typeSpeed={150}
          deleteSpeed={120}
          delaySpeed={1000}
        />
      </span>
    </h1>
  );
}
