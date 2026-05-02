import { Card, CardContent } from "@/components/ui/card";
import { MaterialChip, MaterialCategory } from "./MaterialChip";
import { ExpiryCountdown } from "./ExpiryCountdown";
import { MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ListingCardProps {
  id: string;
  title: string;
  category: MaterialCategory;
  quantity: string;
  priceTag: string; // e.g., "FREE", "SWAP", "₹4,500"
  distance: string; // e.g., "1.2 km"
  heroImageUrl: string;
  expiresAt: string;
  isVerifiedSeller?: boolean;
  variant?: "grid" | "list";
  className?: string;
}

export function ListingCard({
  id, title, category, quantity, priceTag, distance, heroImageUrl, expiresAt, isVerifiedSeller, variant = "grid", className
}: ListingCardProps) {
  
  if (variant === "list") {
    return (
      <Card className={cn("overflow-hidden hover:border-loop-400 transition-colors cursor-pointer w-full", className)}>
        <div className="flex h-[120px]">
          <div className="w-[120px] h-full relative shrink-0 bg-forge-100">
            {heroImageUrl ? (
              <Image src={heroImageUrl} alt={title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-forge-300">No image</div>
            )}
            <div className="absolute top-2 right-2">
               <Badge variant="secondary" className="bg-white/90 text-forge-900 font-mono text-[10px] px-1 py-0">{quantity}</Badge>
            </div>
          </div>
          <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading font-bold text-base text-forge-900 truncate">{title}</h3>
                <span className="font-heading font-bold text-loop-600 text-sm whitespace-nowrap">{priceTag}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MaterialChip category={category} />
                {isVerifiedSeller && (
                  <div className="flex items-center gap-1 text-ok text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-forge-600 text-xs font-mono">
                <MapPin className="w-3 h-3" />
                {distance}
              </div>
              <ExpiryCountdown expiresAt={expiresAt} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid Variant
  return (
    <Card className={cn("overflow-hidden hover:border-loop-400 transition-colors cursor-pointer flex flex-col", className)}>
      <div className="w-full h-[140px] relative bg-forge-100">
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-forge-300">No image</div>
        )}
        <div className="absolute top-2 left-2">
          <MaterialChip category={category} />
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-forge-900 font-mono text-[11px] px-1.5 py-0.5">{quantity}</Badge>
        </div>
      </div>
      <CardContent className="p-3 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-heading font-bold text-sm text-forge-900 line-clamp-2 leading-tight flex-1">{title}</h3>
        </div>
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-loop-600">{priceTag}</span>
            <div className="flex items-center gap-1 text-forge-600 text-xs font-mono">
              <MapPin className="w-3.5 h-3.5" />
              {distance}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ExpiryCountdown expiresAt={expiresAt} />
            {isVerifiedSeller && <ShieldCheck className="w-4 h-4 text-ok ml-auto" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
