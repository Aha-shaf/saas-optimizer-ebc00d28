import { useState, useMemo } from 'react';
import { Header } from '@/components/layout';
import { useApps, useCreateApp, useDeleteApp } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SaaSCategory } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const categories: SaaSCategory[] = [
  'CRM', 'Project Management', 'Communication', 'HR & Payroll',
  'Finance & Accounting', 'Marketing', 'Engineering', 'Security',
  'Analytics', 'Productivity', 'Other',
];

const statusColors: Record<string, string> = {
  active: 'bg-success/20 text-success',
  inactive: 'bg-muted text-muted-foreground',
  pending_review: 'bg-warning/20 text-warning',
};

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    category: 'Productivity' as SaaSCategory,
    vendor: '',
    licensesPurchased: 0,
    costPerLicense: 0,
    billingCycle: 'monthly' as const,
    renewalDate: '',
    ownerDepartment: '',
  });

  const { data: apps = [], isLoading } = useApps({
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });
  const createApp = useCreateApp();
  const deleteApp = useDeleteApp();

  const totalSpend = useMemo(
    () => apps.reduce((sum: number, app: any) => sum + (app.licensesPurchased || 0) * (app.costPerLicense || 0), 0),
    [apps]
  );
  const totalLicenses = useMemo(
    () => apps.reduce((sum: number, app: any) => sum + (app.licensesPurchased || 0), 0),
    [apps]
  );
  const usedLicenses = useMemo(
    () => apps.reduce((sum: number, app: any) => sum + (app.licensesUsed || 0), 0),
    [apps]
  );

  const handleAddApp = async () => {
    try {
      await createApp.mutateAsync({
        ...newApp,
        contractStartDate: new Date().toISOString(),
        contractEndDate: newApp.renewalDate,
      });
      toast.success('Application added successfully');
      setIsAddDialogOpen(false);
      setNewApp({
        name: '', category: 'Productivity', vendor: '', licensesPurchased: 0,
        costPerLicense: 0, billingCycle: 'monthly', renewalDate: '', ownerDepartment: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add application');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApp.mutateAsync(id);
      toast.success('Application deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete application');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="SaaS Inventory" subtitle="Loading..." />
        <div className="p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="SaaS Inventory"
        subtitle={`${apps.length} applications • $${totalSpend.toLocaleString()}/mo total spend`}
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Apps</p>
              <p className="text-2xl font-bold text-foreground">{apps.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Monthly Spend</p>
              <p className="text-2xl font-bold text-foreground">${totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Licenses</p>
              <p className="text-2xl font-bold text-foreground">{totalLicenses.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Utilization Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {totalLicenses > 0 ? Math.round((usedLicenses / totalLicenses) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add SaaS Application</DialogTitle>
                  <DialogDescription>Add a new application to your SaaS inventory</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={newApp.name} onChange={(e) => setNewApp({ ...newApp, name: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vendor" className="text-right">Vendor</Label>
                    <Input id="vendor" value={newApp.vendor} onChange={(e) => setNewApp({ ...newApp, vendor: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Select value={newApp.category} onValueChange={(value: SaaSCategory) => setNewApp({ ...newApp, category: value })}>
                      <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="licenses" className="text-right">Licenses</Label>
                    <Input id="licenses" type="number" value={newApp.licensesPurchased} onChange={(e) => setNewApp({ ...newApp, licensesPurchased: parseInt(e.target.value) || 0 })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">Cost/License</Label>
                    <Input id="cost" type="number" step="0.01" value={newApp.costPerLicense} onChange={(e) => setNewApp({ ...newApp, costPerLicense: parseFloat(e.target.value) || 0 })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">Department</Label>
                    <Input id="department" value={newApp.ownerDepartment} onChange={(e) => setNewApp({ ...newApp, ownerDepartment: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="renewal" className="text-right">Renewal Date</Label>
                    <Input id="renewal" type="date" value={newApp.renewalDate} onChange={(e) => setNewApp({ ...newApp, renewalDate: e.target.value })} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddApp} disabled={!newApp.name || createApp.isPending}>
                    {createApp.isPending ? 'Adding...' : 'Add Application'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Application</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Renewal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No applications found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  apps.map((app: any) => {
                    const purchased = app.licensesPurchased || 0;
                    const used = app.licensesUsed || 0;
                    const utilization = purchased > 0 ? Math.round((used / purchased) * 100) : 0;
                    const monthlyCost = purchased * (app.costPerLicense || 0);

                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {app.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{app.name}</p>
                              <p className="text-xs text-muted-foreground">{app.vendor}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{app.category}</Badge></TableCell>
                        <TableCell>
                          <span className="text-foreground">{used}</span>
                          <span className="text-muted-foreground"> / {purchased}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={`h-full rounded-full ${utilization >= 80 ? 'bg-success' : utilization >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${monthlyCost.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.renewalDate ? format(new Date(app.renewalDate), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status] || ''}>
                            {app.status?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><ExternalLink className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(app.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
