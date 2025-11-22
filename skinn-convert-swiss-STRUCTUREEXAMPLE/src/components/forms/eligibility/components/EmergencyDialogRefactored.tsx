import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { MinimalButton } from '@/components/ui/minimal-button';
import { Phone, ArrowRight } from 'lucide-react';

// Atoms & Molecules
import { EmergencyHeader } from '../atoms/EmergencyHeader';
import { SafetyNotice } from '../atoms/SafetyNotice';
import { EmergencyContactCard } from '../molecules/EmergencyContactCard';
import { RecommendationsList } from '../molecules/RecommendationsList';

// Utils
import { getEmergencyMessage } from '../utils/emergencyMessages';

interface EmergencyDialogProps {
  open: boolean;
  symptom: string;
  onClose: () => void;
  onCallEmergency: () => void;
  onContinueAnyway?: () => void;
}

export const EmergencyDialog: React.FC<EmergencyDialogProps> = ({
  open,
  symptom,
  onClose,
  onCallEmergency,
  onContinueAnyway,
}) => {
  const emergencyInfo = getEmergencyMessage(symptom);
  const { title, message, severity, urgency, recommendations } = emergencyInfo;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <EmergencyHeader
            title={title}
            message={message}
            severity={severity}
            urgency={urgency}
          />
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          <EmergencyContactCard severity={severity} />
          <RecommendationsList 
            recommendations={recommendations} 
            severity={severity} 
          />
          
          {severity === 'high' && <SafetyNotice symptom={symptom} />}
        </div>
        
        <DialogFooter className="mt-8 flex flex-col gap-3">
          {/* Primary Action */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <MinimalButton
              className={`flex-1 h-12 text-white font-semibold ${
                severity === 'high' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
              onClick={onCallEmergency}
            >
              <Phone className="h-5 w-5 mr-3" />
              Call Emergency Services Now
              <ArrowRight className="h-5 w-5 ml-3" />
            </MinimalButton>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {onContinueAnyway && severity !== 'high' && (
              <MinimalButton
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onContinueAnyway}
              >
                I'll Monitor and Continue Assessment
              </MinimalButton>
            )}
            
            <MinimalButton
              variant="ghost" 
              className="flex-1 text-gray-600 hover:bg-gray-100"
              onClick={onClose}
            >
              Close and Review My Symptoms
            </MinimalButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};