import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, Users, UserCheck, Phone } from "lucide-react";

interface InsuranceSelectorProps {
  hasInsurance: boolean;
  model: string;
  onInsuranceChange: (hasInsurance: boolean) => void;
  onModelChange: (model: string) => void;
}

const models = [
  { id: "standard", name: "Standard", icon: Shield, desc: "Free choice of doctors" },
  { id: "hmo", name: "HMO", icon: Users, desc: "Coordinated care network" },
  { id: "family-doctor", name: "Family Doctor", icon: UserCheck, desc: "Primary care physician" },
  { id: "telmed", name: "Telmed", icon: Phone, desc: "Telephone consultation first" }
];

export const SwissInsuranceSelector: React.FC<InsuranceSelectorProps> = ({
  hasInsurance,
  model,
  onInsuranceChange,
  onModelChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Do you have Swiss insurance?</Label>
        <RadioGroup 
          value={hasInsurance ? "yes" : "no"} 
          onValueChange={(v) => onInsuranceChange(v === "yes")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="ins-yes" />
            <Label htmlFor="ins-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="ins-no" />
            <Label htmlFor="ins-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      {hasInsurance && (
        <RadioGroup value={model} onValueChange={onModelChange} className="grid grid-cols-2 gap-3">
          {models.map(m => {
            const Icon = m.icon;
            return (
              <Label key={m.id} htmlFor={m.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <RadioGroupItem value={m.id} id={m.id} />
                <Icon className="h-4 w-4 text-[#004C96]" />
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
};