
import React from 'react';

interface TestimonialProps {
  testimonial: {
    quote: string;
    name: string;
    title: string;
    image?: string;
  };
}

const TestimonialCard: React.FC<TestimonialProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <svg
        width="32"
        height="32"
        viewBox="0 0 42 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 text-primary/30"
      >
        <path
          d="M11.6249 36L0.374945 24.75V13.5H15.7499V28.125H4.49995L11.6249 36ZM33.7499 36L22.4999 24.75V13.5H37.8749V28.125H26.6249L33.7499 36Z"
          fill="currentColor"
        />
      </svg>
      <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
      <div className="flex items-center">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium text-lg">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
