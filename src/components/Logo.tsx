
import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
};

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  return (
    <Link to="/" className="flex items-center gap-2 font-bold">
      <div className="fitness-gradient p-1.5 rounded-lg">
        <Dumbbell className="text-white" size={iconSizes[size]} />
      </div>
      <span className={`${sizeClasses[size]} bg-clip-text text-transparent fitness-gradient`}>
        FitTrack
      </span>
    </Link>
  );
};

export default Logo;
