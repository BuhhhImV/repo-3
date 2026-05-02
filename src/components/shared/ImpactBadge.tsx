import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImpactBadgeProps {
  weightKg: number;
  className?: string;
}

export function ImpactBadge({ weightKg, className }: ImpactBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn("bg-diverted-100 text-diverted-600 hover:bg-diverted-100 border border-diverted-100 rounded-full px-2 py-1 font-mono font-bold", className)}
    >
      {weightKg.toLocaleString()} kg diverted
    </Badge>
  );
}
