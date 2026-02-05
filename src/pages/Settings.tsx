import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Bell,
  Shield,
  Palette,
  Link,
  Save,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockOrganization } from '@/data/mockData';

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Settings"
        subtitle="Manage your organization and preferences"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="organization" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="organization" className="gap-2">
                <Building2 className="w-4 h-4" />
                Organization
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2">
                <Link className="w-4 h-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="organization">
              <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Organization Details
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Name</Label>
                    <Input
                      defaultValue={mockOrganization.name}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Domain</Label>
                    <Input
                      defaultValue={mockOrganization.domain}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Industry</Label>
                    <Input
                      defaultValue="Technology"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Employees</Label>
                    <Input
                      defaultValue="500-1000"
                      className="col-span-3"
                    />
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Notification Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">New Recommendations</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new optimization recommendations are available
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Upcoming Renewals</p>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts 30, 14, and 7 days before contract renewals
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Usage Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when license utilization drops below threshold
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Weekly Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly email digest of SaaS spend and savings
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all users in the organization
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">SSO Enforcement</p>
                      <p className="text-sm text-muted-foreground">
                        Require single sign-on for all logins
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out users after 30 minutes of inactivity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Audit Logging</p>
                      <p className="text-sm text-muted-foreground">
                        Keep detailed logs of all user actions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Connected Integrations
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Google Workspace', status: 'connected', icon: '🔗' },
                    { name: 'Okta SSO', status: 'connected', icon: '🔐' },
                    { name: 'Slack', status: 'pending', icon: '💬' },
                    { name: 'Jira', status: 'not_connected', icon: '📋' },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="font-medium text-foreground">{integration.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {integration.status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={integration.status === 'connected' ? 'outline' : 'default'}
                        size="sm"
                      >
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance">
              <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Appearance
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-foreground">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select your preferred color theme
                    </p>
                    <div className="flex gap-4">
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-primary bg-primary/5">
                        <div className="w-12 h-8 rounded bg-[#1a1f2e]" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border">
                        <div className="w-12 h-8 rounded bg-white border" />
                        <span className="text-sm">Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border">
                        <div className="w-12 h-8 rounded bg-gradient-to-r from-white to-[#1a1f2e]" />
                        <span className="text-sm">System</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
