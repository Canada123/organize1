import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Activity, 
  FileText, 
  Settings,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';

/**
 * TabNavigation - Protected Component
 * 
 * PROTECTED: Used by marketing ops
 * - STYLE OVERRIDE ONLY: Only styling changes allowed
 * - Tab structure and IDs must remain unchanged
 * - Marketing automation depends on specific tab IDs
 * 
 * This component provides navigation between different data views
 * used in marketing operations and analytics.
 */

interface TabData {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const tabs: TabData[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'activity', label: 'Activity', icon: Activity, badge: 'Live' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: '3 New' },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings }
];

interface TabNavigationProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  defaultTab = 'overview',
  onTabChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className={`w-full ${className}`}
    >
      <TabsList className="grid w-full grid-cols-5 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-marketing-tab={tab.id} // Required for marketing ops tracking
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-5 px-1 text-xs"
                >
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Heart Health Overview</h3>
              <Badge variant="outline">Last 14 days</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">98.5%</div>
                <div className="text-sm text-muted-foreground">Normal Rhythm</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">72 bpm</div>
                <div className="text-sm text-muted-foreground">Avg Heart Rate</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">336 hrs</div>
                <div className="text-sm text-muted-foreground">Monitoring Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Real-time Activity</h3>
              <Badge variant="destructive" className="ml-auto animate-pulse">
                Live
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm">Current Heart Rate</span>
                <span className="font-semibold">75 bpm</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm">Activity Level</span>
                <span className="font-semibold">Moderate</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm">Steps Today</span>
                <span className="font-semibold">8,432</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">14-Day Summary Report</div>
                    <div className="text-sm text-muted-foreground">Generated 2 hours ago</div>
                  </div>
                </div>
                <Badge>New</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Weekly Rhythm Analysis</div>
                    <div className="text-sm text-muted-foreground">Generated yesterday</div>
                  </div>
                </div>
                <Badge>New</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Monthly Trend Report</div>
                    <div className="text-sm text-muted-foreground">Generated 3 days ago</div>
                  </div>
                </div>
                <Badge>New</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Health Trends</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Resting Heart Rate</span>
                  <span className="text-sm text-success-green">↓ 3 bpm</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Activity Duration</span>
                  <span className="text-sm text-success-green">↑ 15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sleep Quality</span>
                  <span className="text-sm text-success-green">↑ 8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monitoring Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Alert Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive alerts for irregular rhythms</div>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Data Sync</div>
                  <div className="text-sm text-muted-foreground">Automatic upload every hour</div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Report Generation</div>
                  <div className="text-sm text-muted-foreground">Weekly automated reports</div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TabNavigation;