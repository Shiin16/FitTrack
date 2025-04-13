
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Database } from 'lucide-react';
import { toast } from 'sonner';
import { saveUserData } from '../../services/api';
import { useFitnessData } from '../../contexts/FitnessDataContext';

const AccountCard = () => {
  const { user, logout } = useAuth();
  const { workouts, meals, goals } = useFitnessData();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveData = async () => {
    if (!user?.username) {
      toast.error("Username not found. Cannot save data.");
      return;
    }

    setIsSaving(true);
    try {
      const userData = {
        username: user.username,
        profileData: user.profileData,
        workouts,
        meals,
        goals
      };

      const result = await saveUserData(userData);
      toast.success(`Data saved successfully to ${result.dbFile} (Record #${result.recordId})`);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error("Failed to save data to database. Make sure the backend server is running.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="fitness-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-fitness-primary" />
          Account
        </CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Username
            </label>
            <p className="mt-1 font-medium">{user?.username}</p>
          </div>
          
          <button 
            onClick={handleSaveData}
            disabled={isSaving}
            className="w-full fitness-button bg-fitness-primary hover:bg-fitness-secondary text-white mb-2 flex items-center justify-center"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Save Data to Database
              </>
            )}
          </button>
          
          <button 
            onClick={logout}
            className="w-full fitness-button border border-red-300 text-red-500 hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
