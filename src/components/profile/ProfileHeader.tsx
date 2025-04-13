
import React from 'react';
import { User } from 'lucide-react';

const ProfileHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <User className="mr-2 h-7 w-7 text-fitness-primary" />
        My Profile
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        View and update your personal information
      </p>
    </div>
  );
};

export default ProfileHeader;
