import React from 'react';

interface StageHeaderProps {
  title: string;
  description: string;
}

export const StageHeader: React.FC<StageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-ibm-plex-sans font-bold text-[#004C96] mb-2">
        {title}
      </h2>
      <p className="text-base font-ibm-plex-sans text-[#475259]">
        {description}
      </p>
    </div>
  );
};