import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MaterialCategory = "Industrial" | "Construction" | "Packaging" | "Textiles" | "Electronics" | "Organic" | "Glass";

interface MaterialChipProps {
  category: MaterialCategory;
  className?: string;
}

export function MaterialChip({ category, className }: MaterialChipProps) {
  const colorMap: Record<MaterialCategory, string> = {
    "Industrial": "bg-forge-900 text-forge-50 border-forge-900",
    "Construction": "bg-loop-600 text-loop-100 border-loop-600",
    "Packaging": "bg-info text-white border-info",
    "Textiles": "bg-[#FDF2F8] text-[#EC4899] border-[#EC4899]",
    "Electronics": "bg-[#EDE9FE] text-[#7C3AED] border-[#7C3AED]",
    "Organic": "bg-diverted-600 text-diverted-100 border-diverted-600",
    "Glass": "bg-[#F0FDFA] text-[#0D9488] border-[#0D9488]"
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("rounded-full text-[12px] px-2 py-0.5 font-medium border", colorMap[category], className)}
    >
      {category}
    </Badge>
  );
}
