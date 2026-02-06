import { Header } from '@/components/layout';
import { StatsCard, SpendTrendChart, SpendByCategoryChart } from '@/components/dashboard';
import { useDashboardMetrics, useSpendTrend, useApps } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import {
  Download, FileText, DollarSign, TrendingUp, Calendar, PieChart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function Reports() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: spendTrend = [] } = useSpendTrend();
  const { data: apps = [], isLoading: appsLoading } = useApps();

  const isLoading = metricsLoading || appsLoading;

  // Calculate top spend apps
  const topSpendApps = [...apps]
    .map((app: any) => ({
      ...app,
      totalSpend: (app.licensesPurchased || 0) * (app.costPerLicense || 0),
    }))
    .sort((a: any, b: any) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  // Calculate total realized savings
  const totalRealizedSavings = spendTrend.reduce((sum: number, m: any) => sum + (m.savings || 0), 0);

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen">
        <Header title="Reports" subtitle="Loading..." />
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <Header title="Reports" subtitle="Financial reports and spend analytics" />

      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button className="gap-2"><Download className="w-4 h-4" />Export Monthly Report</Button>
            <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" />Generate Custom Report</Button>
            <Button variant="outline" className="gap-2"><Calendar className="w-4 h-4" />Schedule Report</Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard title="Total Monthly Spend" value={`$${(metrics.totalSpend || 0).toLocaleString()}`} change={metrics.spendTrend} icon={<DollarSign className="w-6 h-6" />} variant="primary" />
            <StatsCard title="Realized Savings (YTD)" value={`$${totalRealizedSavings.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6" />} variant="success" />
            <StatsCard title="Projected Annual Spend" value={`$${((metrics.totalSpend || 0) * 12).toLocaleString()}`} icon={<Calendar className="w-6 h-6" />} />
            <StatsCard title="Cost per Employee" value={`$${metrics.activeUsers ? Math.round((metrics.totalSpend || 0) / metrics.activeUsers) : 0}`} icon={<PieChart className="w-6 h-6" />} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendTrendChart />
            <SpendByCategoryChart />
          </div>

          {/* Top Spend Table */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Top Applications by Spend</h3>
                <p className="text-sm text-muted-foreground">Highest cost applications in your portfolio</p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Cost/License</TableHead>
                  <TableHead className="text-right">Monthly Spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSpendApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No applications found</TableCell>
                  </TableRow>
                ) : (
                  topSpendApps.map((app: any, index: number) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-medium">#{index + 1}</span>
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {app.name?.charAt(0)}
                          </div>
                          <span className="font-medium">{app.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{app.category}</TableCell>
                      <TableCell>{app.licensesPurchased || 0}</TableCell>
                      <TableCell>${app.costPerLicense || 0}</TableCell>
                      <TableCell className="text-right font-semibold">${(app.totalSpend || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
