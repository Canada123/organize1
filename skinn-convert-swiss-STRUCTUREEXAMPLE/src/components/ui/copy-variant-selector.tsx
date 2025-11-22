import React from 'react';
import { MessageSquare, Check, Zap, Stethoscope, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type CopyVariant = 'benefit-led' | 'clinical' | 'urgency';

interface CopyVariantOption {
  value: CopyVariant;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const copyVariants: CopyVariantOption[] = [
  {
    value: 'benefit-led',
    name: 'Benefit-Led',
    description: 'Focus on patient benefits and outcomes',
    icon: Zap,
  },
  {
    value: 'clinical',
    name: 'Clinical',
    description: 'Emphasize medical validation and evidence',
    icon: Stethoscope,
  },
  {
    value: 'urgency',
    name: 'Urgency',
    description: 'Highlight critical health risks and timing',
    icon: AlertTriangle,
  },
];

interface CopyVariantSelectorProps {
  currentVariant: CopyVariant;
  onVariantChange: (variant: CopyVariant) => void;
}

export const CopyVariantSelector: React.FC<CopyVariantSelectorProps> = ({
  currentVariant,
  onVariantChange,
}) => {
  const currentOption = copyVariants.find(v => v.value === currentVariant) || copyVariants[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Select copy variant</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Copy Messaging</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {copyVariants.map((variant) => (
          <DropdownMenuItem
            key={variant.value}
            onClick={() => onVariantChange(variant.value)}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <div className="flex items-center justify-center w-4 h-4 mt-0.5">
              {currentVariant === variant.value && <Check className="h-3 w-3" />}
            </div>
            <div className="flex items-center gap-2">
              <variant.icon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="font-medium">{variant.name}</div>
                <div className="text-xs text-muted-foreground">{variant.description}</div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};