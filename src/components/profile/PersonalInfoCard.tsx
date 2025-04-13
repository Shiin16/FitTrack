
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const PersonalInfoCard = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [height, setHeight] = useState(user?.profileData?.height?.toString() || '');
  const [weight, setWeight] = useState(user?.profileData?.weight?.toString() || '');
  const [age, setAge] = useState(user?.profileData?.age?.toString() || '');
  const [gender, setGender] = useState(user?.profileData?.gender || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      height: height ? Number(height) : 0,
      weight: weight ? Number(weight) : 0,
      age: age ? Number(age) : 0,
      gender,
    });
    
    setIsEditing(false);
  };

  return (
    <Card className="fitness-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-fitness-primary" />
            Personal Information
          </CardTitle>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm text-fitness-primary hover:text-fitness-secondary font-medium"
            >
              Edit
            </button>
          )}
        </div>
        <CardDescription>Your physical stats and information</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="fitness-input w-full"
                  placeholder="Height in cm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="fitness-input w-full"
                  placeholder="Weight in kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="fitness-input w-full"
                  placeholder="Your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="fitness-input w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="fitness-button border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="fitness-button-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Height</h3>
              <p className="font-medium">
                {user?.profileData?.height ? `${user.profileData.height} cm` : 'Not set'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Weight</h3>
              <p className="font-medium">
                {user?.profileData?.weight ? `${user.profileData.weight} kg` : 'Not set'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Age</h3>
              <p className="font-medium">
                {user?.profileData?.age ? `${user.profileData.age} years` : 'Not set'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gender</h3>
              <p className="font-medium capitalize">
                {user?.profileData?.gender || 'Not set'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
