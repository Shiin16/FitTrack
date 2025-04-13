
import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import AccountCard from '../components/profile/AccountCard';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProfileHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AccountCard />
        </div>

        <div className="md:col-span-2">
          <PersonalInfoCard />
        </div>
      </div>
    </div>
  );
};

export default Profile;
