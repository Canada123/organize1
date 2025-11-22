import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MinimalButton } from '@/components/ui/minimal-button';
import { AlertTriangle, Phone, ArrowRight } from 'lucide-react';

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
  const getEmergencyMessage = (symptom: string) => {
    if (symptom.toLowerCase().includes('fainting') || symptom.toLowerCase().includes('loss of consciousness')) {
      return {
        title: 'Immediate Medical Attention Required',
        message: 'Loss of consciousness or fainting can indicate serious cardiac arrhythmias or other life-threatening conditions.',
        severity: 'high',
        urgency: 'CRITICAL',
        recommendations: [
          'Call 144 immediately if symptoms are ongoing',
          'Do not drive or operate machinery',
          'Have someone stay with you',
          'Seek emergency care within the next hour'
        ]
      };
    }
    if (symptom.toLowerCase().includes('chest pain')) {
      return {
        title: 'Urgent Cardiac Assessment Required',
        message: 'Chest pain or discomfort can be a sign of heart attack, angina, or other serious cardiac conditions requiring immediate evaluation.',
        severity: 'high',
        urgency: 'URGENT',
        recommendations: [
          'Call 144 if pain is severe or worsening',
          'Do not delay seeking medical care',
          'Avoid physical exertion',
          'Take prescribed cardiac medications if available'
        ]
      };
    }
    return {
      title: 'Medical Review Recommended',
      message: 'Your symptoms may require professional medical evaluation before proceeding with monitoring.',
      severity: 'medium',
      urgency: 'MODERATE',
      recommendations: [
        'Contact your family doctor within 24 hours',
        'Monitor symptoms for changes',
        'Seek immediate care if symptoms worsen'
      ]
    };
  };

  const { title, message, severity, urgency, recommendations } = getEmergencyMessage(symptom);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              severity === 'high' ? 'bg-red-600' : 'bg-amber-500'
            } shadow-lg`}>
              <AlertTriangle className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  severity === 'high' 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {urgency}
                </div>
              </div>
              <DialogDescription className="text-base text-gray-700 leading-relaxed">
                {message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          {/* Emergency Contact Card */}
          <div className={`border-2 rounded-xl p-5 ${
            severity === 'high' 
              ? 'bg-red-50 border-red-300' 
              : 'bg-amber-50 border-amber-300'
          }`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 text-lg mb-2">Swiss Emergency Services</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-red-200">
                    <div>
                      <p className="font-semibold text-red-900">Medical Emergency</p>
                      <p className="text-sm text-red-700">24/7 Emergency Response</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-900">144</p>
                      <p className="text-xs text-red-700">Free from any phone</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-red-200">
                    <div>
                      <p className="font-semibold text-red-900">European Emergency</p>
                      <p className="text-sm text-red-700">Alternative emergency line</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-900">112</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Immediate Recommendations
            </h3>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                    severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Warning for High Severity */}
          {severity === 'high' && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-bold text-red-900 mb-1">Critical Safety Notice</h4>
                  <p className="text-sm text-red-800 leading-relaxed">
                    <strong>Do not delay medical care.</strong> If you are currently experiencing {symptom.toLowerCase()}, 
                    this assessment should be postponed until after you receive appropriate medical evaluation 
                    and treatment. Your safety is our highest priority.
                  </p>
                </div>
              </div>
            </div>
          )}
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