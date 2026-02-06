import { Header } from '@/components/layout';
import {
  StatsCard,
  SpendTrendChart,
  SpendByCategoryChart,
  OptimizationScore,
  UpcomingRenewals,
  RecentRecommendations,
} from '@/components/dashboard';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardMetrics } from '@/hooks/useApi';
import {
  DollarSign,
  Package,
  Users,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen">
        <Header
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
          subtitle="Here's what's happening with your SaaS portfolio"
        />
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
        subtitle="Here's what's happening with your SaaS portfolio"
      />

      <div className="p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Key Metrics */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total SaaS Spend"
              value={`$${(metrics.totalSpend || 0).toLocaleString()}`}
              change={metrics.spendTrend}
              changeLabel="vs last month"
              icon={<DollarSign className="w-6 h-6" />}
              variant="primary"
            />
            <StatsCard
              title="Total Applications"
              value={metrics.totalApps || 0}
              icon={<Package className="w-6 h-6" />}
            />
            <StatsCard
              title="Unused Licenses"
              value={metrics.unusedLicenses || 0}
              icon={<Users className="w-6 h-6" />}
              variant="warning"
            />
            <StatsCard
              title="Potential Savings"
              value={`$${(metrics.potentialSavings || 0).toLocaleString()}`}
              icon={<TrendingDown className="w-6 h-6" />}
              variant="success"
            />
          </motion.div>

          {/* Secondary Metrics */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Upcoming Renewals"
              value={metrics.upcomingRenewals || 0}
              icon={<Calendar className="w-6 h-6" />}
            />
            <StatsCard
              title="Active Users"
              value={metrics.activeUsers || 0}
              icon={<Users className="w-6 h-6" />}
            />
            <StatsCard
              title="Optimization Score"
              value={`${metrics.optimizationScore || 0}%`}
              icon={<TrendingDown className="w-6 h-6" />}
              variant="success"
            />
          </motion.div>

          {/* Charts Row */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SpendTrendChart />
            </div>
            <div>
              <OptimizationScore score={metrics.optimizationScore || 0} />
            </div>
          </motion.div>

          {/* Bottom Row */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <SpendByCategoryChart />
            </div>
            <div>
              <UpcomingRenewals />
            </div>
            <div>
              <RecentRecommendations />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
