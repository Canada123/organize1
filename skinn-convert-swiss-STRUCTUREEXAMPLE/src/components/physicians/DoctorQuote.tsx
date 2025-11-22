
import React from 'react';

interface DoctorQuoteProps {
  quote: string;
  name: string;
  title: string;
  image: string;
}

const DoctorQuote: React.FC<DoctorQuoteProps> = ({ quote, name, title, image }) => {
  return (
    <div className="bg-muted/30 p-6 rounded-xl border border-primary/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img 
            src={image} 
            alt={`Dr. ${name}`} 
            className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-2 border-primary"
          />
        </div>
        <div className="flex-grow">
          <svg
            width="32"
            height="32"
            viewBox="0 0 42 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2 text-primary/30"
          >
            <path
              d="M11.6249 36L0.374945 24.75V13.5H15.7499V28.125H4.49995L11.6249 36ZM33.7499 36L22.4999 24.75V13.5H37.8749V28.125H26.6249L33.7499 36Z"
              fill="currentColor"
            />
          </svg>
          <blockquote className="italic text-foreground mb-4">{quote}</blockquote>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorQuote;
