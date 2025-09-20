
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-md border border-slate-200 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
