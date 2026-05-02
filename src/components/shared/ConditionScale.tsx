import { cn } from "@/lib/utils";

export type ConditionLevel = 'scrap' | 'fair' | 'good' | 'like-new' | 'new';

interface ConditionScaleProps {
  level: ConditionLevel;
  className?: string;
}

const levels: ConditionLevel[] = ['scrap', 'fair', 'good', 'like-new', 'new'];

const labelMap: Record<ConditionLevel, string> = {
  'scrap': 'Scrap-only',
  'fair': 'Fair',
  'good': 'Good',
  'like-new': 'Like-new',
  'new': 'New'
};

export function ConditionScale({ level, className }: ConditionScaleProps) {
  const activeIndex = levels.indexOf(level);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {levels.map((lvl, idx) => (
          <div 
            key={lvl}
            className={cn(
              "w-2 h-2 rounded-full",
              idx <= activeIndex ? "bg-loop-600" : "bg-forge-300"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-forge-600">
        {labelMap[level]}
      </span>
    </div>
  );
}
