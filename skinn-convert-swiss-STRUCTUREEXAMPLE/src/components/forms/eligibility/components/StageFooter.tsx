import React from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';

interface StageFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  nextLabel?: string;
  backLabel?: string;
  saveLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  showSave?: boolean;
}

export const StageFooter: React.FC<StageFooterProps> = ({
  onBack,
  onNext,
  onSave,
  nextLabel = 'Continue',
  backLabel = 'Back',
  saveLabel = 'Save & Continue Later',
  nextDisabled = false,
  backDisabled = false,
  showSave = false,
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#004C96]/10">
      <div className="flex gap-3">
        {onBack && (
          <MinimalButton
            variant="secondary"
            onClick={onBack}
            disabled={backDisabled}
          >
            {backLabel}
          </MinimalButton>
        )}
        {showSave && onSave && (
          <MinimalButton
            variant="ghost"
            onClick={onSave}
          >
            {saveLabel}
          </MinimalButton>
        )}
      </div>
      {onNext && (
        <MinimalButton
          variant="primary"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </MinimalButton>
      )}
    </div>
  );
};