import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Moon, 
  Coffee, 
  Heart,
  Droplets,
  Pill,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

/**
 * ContributingFactorCards - Protected Component
 * 
 * PROTECTED: Regulatory copy approved
 * - TEXT ONLY: Only text content can be modified
 * - All medical claims must be pre-approved
 * - Regulatory compliance required for any changes
 * 
 * This component displays contributing factors to cardiac health
 * with regulatory-approved medical information.
 */

interface FactorCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'attention' | 'good' | 'neutral';
}

const factors: FactorCard[] = [
  {
    id: 'activity',
    icon: Activity,
    title: 'Physical Activity',
    description: 'Regular exercise strengthens the heart muscle and improves circulation',
    impact: 'high',
    status: 'good'
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Sleep Quality',
    description: 'Poor sleep is linked to increased risk of heart disease and arrhythmias',
    impact: 'high',
    status: 'attention'
  },
  {
    id: 'caffeine',
    icon: Coffee,
    title: 'Caffeine Intake',
    description: 'Excessive caffeine can trigger heart palpitations in sensitive individuals',
    impact: 'medium',
    status: 'neutral'
  },
  {
    id: 'stress',
    icon: Heart,
    title: 'Stress Levels',
    description: 'Chronic stress contributes to high blood pressure and heart disease',
    impact: 'high',
    status: 'attention'
  },
  {
    id: 'hydration',
    icon: Droplets,
    title: 'Hydration',
    description: 'Proper hydration helps maintain healthy blood pressure and heart rate',
    impact: 'medium',
    status: 'good'
  },
  {
    id: 'medication',
    icon: Pill,
    title: 'Medications',
    description: 'Certain medications can affect heart rhythm - consult your physician',
    impact: 'high',
    status: 'neutral'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'attention':
      return 'text-destructive';
    case 'good':
      return 'text-success-green';
    default:
      return 'text-muted-foreground';
  }
};

const getImpactBadge = (impact: string) => {
  switch (impact) {
    case 'high':
      return <Badge variant="destructive" className="text-xs">High Impact</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="text-xs">Medium Impact</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Low Impact</Badge>;
  }
};

export const ContributingFactorCards: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Contributing Factors to Heart Health
        </h2>
        <p className="text-muted-foreground">
          Understanding these factors can help improve your cardiac health
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map((factor) => {
          const Icon = factor.icon;
          return (
            <Card key={factor.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Icon className={`h-5 w-5 ${getStatusColor(factor.status)}`} />
                  {getImpactBadge(factor.impact)}
                </div>
                <CardTitle className="text-lg mt-2">{factor.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {factor.description}
                </p>
                
                {factor.status === 'attention' && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>Requires attention</span>
                  </div>
                )}
                
                {factor.status === 'good' && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-success-green">
                    <TrendingUp className="h-3 w-3" />
                    <span>Keep it up</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-xs text-muted-foreground">
          This information is for educational purposes only and does not replace professional medical advice.
          Always consult with your healthcare provider about your specific health conditions.
        </p>
      </div>
    </div>
  );
};

export default ContributingFactorCards;