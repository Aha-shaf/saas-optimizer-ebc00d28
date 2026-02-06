import { useRenewals } from '@/hooks/useApi';
import { Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingRenewals() {
  const { data: renewals = [], isLoading } = useRenewals();

  const getDaysUntil = (dateString: string) => differenceInDays(new Date(dateString), new Date());

  const getUrgencyBadge = (days: number) => {
    if (days <= 14) return <Badge className="bg-danger/20 text-danger border-0">Urgent</Badge>;
    if (days <= 30) return <Badge className="bg-warning/20 text-warning border-0">Soon</Badge>;
    return <Badge variant="secondary">Upcoming</Badge>;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Renewals</h3>
          <p className="text-sm text-muted-foreground">Contracts expiring soon</p>
        </div>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>

      {renewals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No upcoming renewals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {renewals.slice(0, 5).map((app: any) => {
            const renewalDate = app.renewalDate || app.renewal_date;
            const daysUntil = getDaysUntil(renewalDate);
            const totalCost = (app.licensesPurchased || 0) * (app.costPerLicense || 0);

            return (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {app.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(renewalDate), 'MMM d, yyyy')} • {daysUntil} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">${totalCost.toLocaleString()}/mo</span>
                  {getUrgencyBadge(daysUntil)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
