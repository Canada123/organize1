import React from 'react';
interface MyantLogoProps {
  className?: string;
}
const MyantLogo: React.FC<MyantLogoProps> = ({
  className = ""
}) => {
  return <div className={`flex items-center ${className}`}>
      <img alt="Myant Logo" className="h-10 w-auto mr-2" src="/assets/logos/Myant_new_logo.png" />
    </div>;
};
export default MyantLogo;