import { mockRecommendations } from '@/data/mockData';
import { Lightbulb, ArrowRight, TrendingDown, Layers, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import type { RecommendationType } from '@/types';

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
  const pendingRecs = mockRecommendations.filter(r => r.status === 'pending').slice(0, 4);
  const totalPotentialSavings = pendingRecs.reduce((sum, r) => sum + r.estimated_monthly_savings, 0);

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

      <div className="space-y-3">
        {pendingRecs.map((rec) => (
          <div
            key={rec.id}
            className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            onClick={() => navigate('/recommendations')}
          >
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                {typeIcons[rec.type]}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{rec.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[rec.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {rec.affected_users} users affected
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-success text-sm">
                ${rec.estimated_monthly_savings.toLocaleString()}/mo
              </p>
              <p className="text-xs text-muted-foreground">
                ${rec.estimated_annual_savings.toLocaleString()}/yr
              </p>
            </div>
          </div>
        ))}
      </div>

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
