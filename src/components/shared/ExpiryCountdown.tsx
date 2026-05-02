"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ExpiryCountdownProps {
  expiresAt: string | Date;
  className?: string;
}

export function ExpiryCountdown({ expiresAt, className }: ExpiryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        return { hours, minutes };
      }
      return { hours: 0, minutes: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) return null;

  // Only show countdown if less than 48 hours
  if (timeLeft.hours >= 48) {
    return null;
  }

  let colorClass = "text-ok";
  if (timeLeft.hours < 12) {
    colorClass = "text-crit";
  } else if (timeLeft.hours < 48) {
    colorClass = "text-warn";
  }

  return (
    <div className={cn("flex items-center gap-1.5 font-mono text-sm font-medium", colorClass, className)}>
      <Clock className="w-4 h-4" />
      {timeLeft.hours}h {timeLeft.minutes}m left
    </div>
  );
}
