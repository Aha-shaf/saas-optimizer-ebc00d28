import { useRecommendations } from '@/hooks/useApi';
import { Lightbulb, ArrowRight, TrendingDown, Layers, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import type { RecommendationType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const typeIcons: Record<RecommendationType, React.ReactNode> = {
  reclaim_license: <TrendingDown className="w-4 h-4" />,
  downgrade_plan: <TrendingDown className="w-4 h-4" />,
  consolidate_tools: <Layers className="w-4 h-4" />,
  renegotiate_contract: <RefreshCw className="w-4 h-4" />,
  terminate_subscription: <XCircle className="w-4 h-4" />,
};

const typeLabels: Record<RecommendationType, string> = {
  reclaim_license: 'Reclaim',
  downgrade_plan: 'Downgrade',
  consolidate_tools: 'Consolidate',
  renegotiate_contract: 'Renegotiate',
  terminate_subscription: 'Terminate',
};

export function RecentRecommendations() {
  const navigate = useNavigate();
  const { data: recommendations = [], isLoading } = useRecommendations({ status: 'pending' });

  const pendingRecs = recommendations.slice(0, 4);
  const totalPotentialSavings = pendingRecs.reduce(
    (sum: number, r: any) => sum + (r.estimatedMonthlySavings || 0), 0
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pending Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            ${totalPotentialSavings.toLocaleString()}/mo potential savings
          </p>
        </div>
        <Lightbulb className="w-5 h-5 text-warning" />
      </div>

      {pendingRecs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No pending recommendations
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRecs.map((rec: any) => (
            <div
              key={rec.id}
              className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              onClick={() => navigate('/recommendations')}
            >
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  {typeIcons[rec.type as RecommendationType] || <Lightbulb className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{rec.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {typeLabels[rec.type as RecommendationType] || rec.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {rec.affectedUsers || 0} users affected
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-success text-sm">
                  ${(rec.estimatedMonthlySavings || 0).toLocaleString()}/mo
                </p>
                <p className="text-xs text-muted-foreground">
                  ${(rec.estimatedAnnualSavings || 0).toLocaleString()}/yr
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10"
        onClick={() => navigate('/recommendations')}
      >
        View all recommendations
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
