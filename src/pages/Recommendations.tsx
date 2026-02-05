import { useState } from 'react';
import { Header } from '@/components/layout';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  TrendingDown,
  Layers,
  RefreshCw,
  XCircle,
  Check,
  X,
  AlertTriangle,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type { Recommendation, RecommendationType, RecommendationStatus } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const typeIcons: Record<RecommendationType, React.ReactNode> = {
  reclaim_license: <TrendingDown className="w-5 h-5" />,
  downgrade_plan: <TrendingDown className="w-5 h-5" />,
  consolidate_tools: <Layers className="w-5 h-5" />,
  renegotiate_contract: <RefreshCw className="w-5 h-5" />,
  terminate_subscription: <XCircle className="w-5 h-5" />,
};

const typeLabels: Record<RecommendationType, string> = {
  reclaim_license: 'Reclaim Licenses',
  downgrade_plan: 'Downgrade Plan',
  consolidate_tools: 'Consolidate Tools',
  renegotiate_contract: 'Renegotiate Contract',
  terminate_subscription: 'Terminate Subscription',
};

const typeColors: Record<RecommendationType, string> = {
  reclaim_license: 'bg-info/20 text-info',
  downgrade_plan: 'bg-warning/20 text-warning',
  consolidate_tools: 'bg-primary/20 text-primary',
  renegotiate_contract: 'bg-success/20 text-success',
  terminate_subscription: 'bg-danger/20 text-danger',
};

const statusColors: Record<RecommendationStatus, string> = {
  pending: 'bg-warning/20 text-warning',
  approved: 'bg-success/20 text-success',
  rejected: 'bg-danger/20 text-danger',
  implemented: 'bg-info/20 text-info',
};

const impactColors = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-danger',
};

export default function Recommendations() {
  const { recommendations, updateRecommendation } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredRecs = recommendations.filter((rec) => {
    if (activeTab === 'all') return true;
    return rec.status === activeTab;
  });

  const totalPendingSavings = recommendations
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.estimated_monthly_savings, 0);

  const handleApprove = () => {
    if (selectedRec) {
      updateRecommendation(selectedRec.id, { status: 'approved' });
      toast.success(`Approved: ${selectedRec.title}`);
      setIsApproveDialogOpen(false);
      setSelectedRec(null);
    }
  };

  const handleReject = () => {
    if (selectedRec) {
      updateRecommendation(selectedRec.id, { status: 'rejected' });
      toast.info(`Rejected: ${selectedRec.title}`);
      setIsRejectDialogOpen(false);
      setSelectedRec(null);
      setRejectReason('');
    }
  };

  const pendingCount = recommendations.filter((r) => r.status === 'pending').length;
  const approvedCount = recommendations.filter((r) => r.status === 'approved').length;
  const rejectedCount = recommendations.filter((r) => r.status === 'rejected').length;

  return (
    <div className="min-h-screen">
      <Header
        title="Recommendations"
        subtitle={`${pendingCount} pending • $${totalPendingSavings.toLocaleString()}/mo potential savings`}
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Recommendations</p>
              <p className="text-2xl font-bold text-foreground">{recommendations.length}</p>
            </div>
            <div className="bg-card border border-warning/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </div>
            <div className="bg-card border border-success/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Monthly Savings (Approved)</p>
              <p className="text-2xl font-bold text-success">
                $
                {recommendations
                  .filter((r) => r.status === 'approved')
                  .reduce((sum, r) => sum + r.estimated_monthly_savings, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Annual Savings Potential</p>
              <p className="text-2xl font-bold text-foreground">
                $
                {recommendations
                  .filter((r) => r.status === 'pending')
                  .reduce((sum, r) => sum + r.estimated_annual_savings, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <Check className="w-4 h-4" />
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <X className="w-4 h-4" />
                Rejected ({rejectedCount})
              </TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredRecs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
                    <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No recommendations found</p>
                    <p className="text-sm">Check back later for new optimization opportunities</p>
                  </div>
                ) : (
                  filteredRecs.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex gap-4">
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                              typeColors[rec.type]
                            }`}
                          >
                            {typeIcons[rec.type]}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">
                                {rec.title}
                              </h3>
                              <Badge className={statusColors[rec.status]}>
                                {rec.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                              {rec.description}
                            </p>
                            <div className="flex items-center gap-4 pt-2">
                              <Badge variant="outline">{typeLabels[rec.type]}</Badge>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                {rec.affected_users} users
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Teams: {rec.affected_teams.join(', ')}
                              </span>
                              <span className={`text-sm font-medium ${impactColors[rec.impact_level]}`}>
                                {rec.impact_level.toUpperCase()} impact
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-success">
                              ${rec.estimated_monthly_savings.toLocaleString()}
                              <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${rec.estimated_annual_savings.toLocaleString()}/year
                            </p>
                          </div>

                          {rec.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRec(rec);
                                  setIsRejectDialogOpen(true);
                                }}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRec(rec);
                                  setIsApproveDialogOpen(true);
                                }}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          )}

                          {rec.status === 'approved' && (
                            <Button variant="outline" size="sm">
                              Implement
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Recommendation</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this recommendation?
            </DialogDescription>
          </DialogHeader>
          {selectedRec && (
            <div className="py-4">
              <p className="font-medium text-foreground">{selectedRec.title}</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will save approximately{' '}
                <span className="text-success font-semibold">
                  ${selectedRec.estimated_monthly_savings.toLocaleString()}/mo
                </span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Recommendation</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this recommendation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Users are actively using the tool..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
