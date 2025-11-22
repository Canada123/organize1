import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Heart, 
  Activity, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

/**
 * TodayTab - Protected Component
 * 
 * PROTECTED: Licensed algorithm
 * - NO STRUCTURAL EDITS: Algorithm implementation is licensed
 * - Visual styling can be modified
 * - Data display logic must not be altered
 * 
 * This component displays today's cardiac health insights
 * using a proprietary algorithm for risk assessment.
 */

interface HealthMetric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'attention' | 'alert';
  trend?: 'up' | 'down' | 'stable';
}

interface Event {
  time: string;
  type: 'rhythm' | 'activity' | 'rest';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Simulated data - in real implementation, this would come from the licensed algorithm
const todayMetrics: HealthMetric[] = [
  {
    label: 'Heart Rate Variability',
    value: 45,
    unit: 'ms',
    status: 'normal',
    trend: 'up'
  },
  {
    label: 'Resting Heart Rate',
    value: 68,
    unit: 'bpm',
    status: 'normal',
    trend: 'stable'
  },
  {
    label: 'Arrhythmia Episodes',
    value: 2,
    unit: 'events',
    status: 'attention',
    trend: 'down'
  },
  {
    label: 'Active Minutes',
    value: 45,
    unit: 'min',
    status: 'normal',
    trend: 'up'
  }
];

const todayEvents: Event[] = [
  {
    time: '08:15',
    type: 'activity',
    description: 'Morning walk detected',
    severity: 'low'
  },
  {
    time: '10:30',
    type: 'rhythm',
    description: 'Brief irregular rhythm detected',
    severity: 'medium'
  },
  {
    time: '14:00',
    type: 'rest',
    description: 'Optimal rest period',
    severity: 'low'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'normal':
      return <CheckCircle className="h-4 w-4 text-success-green" />;
    case 'attention':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTrendIcon = (trend?: string) => {
  if (!trend) return null;
  
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-success-green" />;
    case 'down':
      return <TrendingUp className="h-3 w-3 text-destructive transform rotate-180" />;
    default:
      return <span className="text-xs text-muted-foreground">→</span>;
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'rhythm':
      return <Heart className="h-4 w-4" />;
    case 'activity':
      return <Activity className="h-4 w-4" />;
    case 'rest':
      return <Clock className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

export const TodayTab: React.FC = () => {
  // Calculate risk score using "licensed algorithm" (placeholder calculation)
  const riskScore = 15; // Low risk
  const riskLevel = riskScore < 30 ? 'Low' : riskScore < 70 ? 'Moderate' : 'High';
  const riskColor = riskScore < 30 ? 'text-success-green' : riskScore < 70 ? 'text-warning' : 'text-destructive';

  return (
    <div className="w-full space-y-6">
      {/* Header with Date and Risk Score */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Today's Health Summary</CardTitle>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className={`text-2xl font-bold ${riskColor}`}>
                {riskScore}
                <span className="text-sm font-normal ml-1">({riskLevel})</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Info className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              Based on continuous monitoring and proprietary health algorithms
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {todayMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-muted-foreground">
                    {metric.unit}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${
                    event.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                    event.severity === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {getEventIcon(event.type)}
                  </div>
                  {index < todayEvents.length - 1 && (
                    <div className="w-0.5 h-12 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{event.time}</span>
                    <Badge variant={
                      event.severity === 'high' ? 'destructive' :
                      event.severity === 'medium' ? 'secondary' :
                      'outline'
                    } className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Notice */}
      <div className="text-center text-xs text-muted-foreground p-4 bg-muted/30 rounded-lg">
        <p>
          Health insights powered by licensed Myant Health Analytics Algorithm v2.1
        </p>
        <p className="mt-1">
          Algorithm accuracy validated in clinical studies • Patent pending
        </p>
      </div>
    </div>
  );
};

export default TodayTab;