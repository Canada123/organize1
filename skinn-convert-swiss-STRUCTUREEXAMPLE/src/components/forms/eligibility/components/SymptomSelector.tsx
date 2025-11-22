import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Heart } from 'lucide-react';

interface SymptomSelectorProps {
  symptoms: string[];
  selectedSymptoms: string[];
  onSymptomToggle: (symptom: string) => void;
}

const SYMPTOM_LIST = [
  {
    text: 'Palpitations or racing heart',
    severity: 'moderate',
    icon: Heart,
    description: 'Irregular or fast heartbeat'
  },
  {
    text: 'Dizziness or light-headedness',
    severity: 'moderate', 
    icon: Heart,
    description: 'Feeling faint or unsteady'
  },
  {
    text: 'Fainting or loss of consciousness',
    severity: 'emergency',
    icon: AlertTriangle,
    description: 'Requires immediate medical attention'
  },
  {
    text: 'Chest pain or discomfort',
    severity: 'emergency',
    icon: AlertTriangle, 
    description: 'Could indicate serious cardiac condition'
  },
  {
    text: 'Shortness of breath',
    severity: 'moderate',
    icon: Heart,
    description: 'Difficulty breathing during activity or rest'
  },
  {
    text: 'Other',
    severity: 'mild',
    icon: null,
    description: 'Other cardiac-related symptoms'
  },
  {
    text: 'None of the above',
    severity: 'none',
    icon: null,
    description: 'No symptoms present'
  }
];

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomToggle,
}) => {
  const isDisabled = (symptom: string) => {
    return symptom !== 'None of the above' && selectedSymptoms.includes('None of the above');
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return {
          container: 'border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-colors',
          checkbox: 'border-red-400 data-[state=checked]:bg-red-600',
          text: 'text-red-900 font-medium',
          description: 'text-red-700'
        };
      case 'moderate':
        return {
          container: 'border border-amber-200 bg-amber-50/30 hover:bg-amber-50 transition-colors',
          checkbox: 'border-amber-400 data-[state=checked]:bg-amber-600',
          text: 'text-amber-900',
          description: 'text-amber-700'
        };
      case 'mild':
        return {
          container: 'border border-[#004C96]/20 hover:bg-[#004C96]/5 transition-colors',
          checkbox: 'border-[#004C96]/30 data-[state=checked]:bg-[#004C96]',
          text: 'text-[#0D0D0D]',
          description: 'text-[#475259]'
        };
      default:
        return {
          container: 'border border-gray-200 hover:bg-gray-50 transition-colors',
          checkbox: 'border-gray-300 data-[state=checked]:bg-gray-600',
          text: 'text-[#0D0D0D]',
          description: 'text-[#475259]'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-lg font-ibm-plex-sans font-semibold text-[#004C96]">
          Symptom Assessment
        </Label>
        <p className="text-sm text-[#475259]">
          Select all symptoms you are currently experiencing. Emergency symptoms will trigger immediate guidance.
        </p>
      </div>
      
      <div className="space-y-3">
        {SYMPTOM_LIST.map((symptom, index) => {
          const styles = getSeverityStyles(symptom.severity);
          const Icon = symptom.icon;
          const isChecked = selectedSymptoms.includes(symptom.text);
          const disabled = isDisabled(symptom.text);
          
          return (
            <div 
              key={symptom.text} 
              className={`relative p-4 rounded-lg cursor-pointer ${styles.container} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${isChecked ? 'ring-2 ring-offset-2 ring-[#004C96]/20' : ''}`}
              onClick={!disabled ? () => onSymptomToggle(symptom.text) : undefined}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={symptom.text}
                  checked={isChecked}
                  onCheckedChange={() => !disabled && onSymptomToggle(symptom.text)}
                  disabled={disabled}
                  className={`mt-1 ${styles.checkbox}`}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <Icon className={`h-4 w-4 ${
                        symptom.severity === 'emergency' 
                          ? 'text-red-600' 
                          : symptom.severity === 'moderate'
                          ? 'text-amber-600'
                          : 'text-[#004C96]'
                      }`} />
                    )}
                    <Label 
                      htmlFor={symptom.text} 
                      className={`text-base font-ibm-plex-sans cursor-pointer ${styles.text}`}
                    >
                      {symptom.text}
                    </Label>
                    {symptom.severity === 'emergency' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded text-xs font-medium text-red-800">
                        <AlertTriangle className="h-3 w-3" />
                        URGENT
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm mt-1 ${styles.description}`}>
                    {symptom.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedSymptoms.some(s => SYMPTOM_LIST.find(sym => sym.text === s)?.severity === 'emergency') && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Emergency Symptoms Detected</h4>
              <p className="text-sm text-red-800">
                You've indicated symptoms that may require immediate medical attention. 
                An emergency guidance dialog will appear to help you decide on the best course of action.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};