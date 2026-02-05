import { Header } from '@/components/layout';
import { mockAuditLogs } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Download,
  Filter,
  Check,
  X,
  FileText,
  Edit,
  Upload,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';

const actionIcons: Record<string, React.ReactNode> = {
  approved_recommendation: <Check className="w-4 h-4 text-success" />,
  rejected_recommendation: <X className="w-4 h-4 text-danger" />,
  exported_report: <FileText className="w-4 h-4 text-info" />,
  updated_app: <Edit className="w-4 h-4 text-warning" />,
  imported_apps: <Upload className="w-4 h-4 text-primary" />,
};

const actionLabels: Record<string, string> = {
  approved_recommendation: 'Approved Recommendation',
  rejected_recommendation: 'Rejected Recommendation',
  exported_report: 'Exported Report',
  updated_app: 'Updated Application',
  imported_apps: 'Imported Applications',
};

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.user_name.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      JSON.stringify(log.details).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Audit Log"
        subtitle="Track all actions and changes across your organization"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                  <p className="text-2xl font-bold text-foreground">{mockAuditLogs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Approvals</p>
              <p className="text-2xl font-bold text-success">
                {mockAuditLogs.filter((l) => l.action === 'approved_recommendation').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Rejections</p>
              <p className="text-2xl font-bold text-danger">
                {mockAuditLogs.filter((l) => l.action === 'rejected_recommendation').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Updates</p>
              <p className="text-2xl font-bold text-foreground">
                {mockAuditLogs.filter((l) => l.action === 'updated_app').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead className="w-[180px]">User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {log.user_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="font-medium text-foreground">{log.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary">
                          {actionIcons[log.action] || <FileText className="w-4 h-4" />}
                        </div>
                        <Badge variant="secondary">
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                      {Object.entries(log.details)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' • ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
