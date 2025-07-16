"use client"
import { Terminal } from "lucide-react"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface AlertProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export function Alert({ 
  title = "Heads up!", 
  description = "You can add components to your app using the cli.",
  icon = <Terminal className="h-6 w-6 text-blue-700 flex-shrink-0" />,
  onClose
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-[450px] w-full animate-in slide-in-from-right">
      <div className="bg-white border-l-4 border-blue-500 shadow-lg p-5 rounded-md">
        <div className="flex items-center gap-4">
          {icon}
          <div className="flex-1">
            <h5 className="text-base font-semibold mb-1">{title}</h5>
            <p className="text-[15px] leading-relaxed text-gray-600">
              {description}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 