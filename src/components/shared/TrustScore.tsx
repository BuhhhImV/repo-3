import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrustScoreProps {
  score: number;
  className?: string;
}

export function TrustScore({ score, className }: TrustScoreProps) {
  let badgeClass = "";
  let label = "";

  if (score >= 80) {
    badgeClass = "bg-teal-100 text-teal-800 border-teal-200";
    label = "Trusted";
  } else if (score >= 50) {
    badgeClass = "bg-green-100 text-green-800 border-green-200";
    label = "Verified";
  } else if (score >= 20) {
    badgeClass = "bg-forge-100 text-forge-600 border-forge-200";
    label = "New";
  } else {
    badgeClass = "bg-red-100 text-red-800 border-red-200";
    label = "Flagged";
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Badge variant="outline" className={cn("px-1.5 py-0.5 rounded-sm flex items-center gap-1", badgeClass)}>
        <Star className="w-3 h-3 fill-current" />
        <span className="font-bold">{score}</span>
      </Badge>
      <span className="text-xs text-forge-600 font-medium">{label}</span>
    </div>
  );
}
