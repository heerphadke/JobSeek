"use client";
interface SwipeButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeButtons({ onSwipeLeft, onSwipeRight }: SwipeButtonsProps) {
  return (
    <div className="flex space-x-4">
      <button onClick={onSwipeLeft} className="p-2 bg-red-500 text-white rounded">
        ❌ Dislike
      </button>
      <button onClick={onSwipeRight} className="p-2 bg-green-500 text-white rounded">
        ✅ Like
      </button>
    </div>
  );
}
