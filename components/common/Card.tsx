import React from 'react';

// Fix: Add onClick and other standard div props to CardProps to allow click handlers.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:hover:bg-slate-700' : '';
  
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
