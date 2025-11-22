import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface Symptom {
  id: string;
  label: string;
  isEmergency?: boolean;
}

interface CompactSymptomSelectorProps {
  symptoms: Symptom[];
  selectedSymptoms: string[];
  onSymptomToggle: (symptomId: string) => void;
}

export const CompactSymptomSelector: React.FC<CompactSymptomSelectorProps> = ({
  symptoms,
  selectedSymptoms,
  onSymptomToggle
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Symptoms</h3>
        <span className="text-sm text-muted-foreground">
          ({selectedSymptoms.length} selected)
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {symptoms.map((symptom) => (
          <Label
            key={symptom.id}
            htmlFor={symptom.id}
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent ${
              symptom.isEmergency ? 'border-red-300 bg-red-50/50' : ''
            }`}
          >
            <Checkbox
              id={symptom.id}
              checked={selectedSymptoms.includes(symptom.id)}
              onCheckedChange={() => onSymptomToggle(symptom.id)}
            />
            {symptom.isEmergency && <AlertTriangle className="h-4 w-4 text-red-600" />}
            <span className={symptom.isEmergency ? 'text-red-700 font-medium' : ''}>
              {symptom.label}
            </span>
          </Label>
        ))}
      </div>
    </div>
  );
};