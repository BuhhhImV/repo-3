import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';

interface OfferStatusPillProps {
  status: OfferStatus;
  className?: string;
}

export function OfferStatusPill({ status, className }: OfferStatusPillProps) {
  const statusConfig: Record<OfferStatus, { bg: string, text: string, label: string }> = {
    'pending': { bg: 'bg-warn/10', text: 'text-warn', label: 'Pending' },
    'accepted': { bg: 'bg-ok/10', text: 'text-ok', label: 'Accepted' },
    'rejected': { bg: 'bg-crit/10', text: 'text-crit', label: 'Rejected' },
    'countered': { bg: 'bg-info/10', text: 'text-info', label: 'Countered' },
    'expired': { bg: 'bg-forge-300/20', text: 'text-forge-600', label: 'Expired' }
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={cn("px-2 py-0.5 rounded-full border-transparent font-medium", config.bg, config.text, className)}
    >
      {config.label}
    </Badge>
  );
}
