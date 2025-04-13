
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitnessData } from '../contexts/FitnessDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

const AddWorkout = () => {
  const navigate = useNavigate();
  const { addWorkout } = useFitnessData();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'calisthenics' | 'gym' | 'running' | 'other'>('gym');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addWorkout({
      date,
      type,
      duration: Number(duration),
      description,
      distance: distance ? Number(distance) : undefined,
    });
    
    navigate('/workouts');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Dumbbell className="mr-2 h-7 w-7 text-fitness-primary" />
          Log Workout
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Record your exercise session
        </p>
      </div>

      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="fitness-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Workout Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="fitness-input w-full"
                required
              >
                <option value="calisthenics">Calisthenics</option>
                <option value="gym">Gym</option>
                <option value="running">Running</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="fitness-input w-full"
                min="1"
                placeholder="How long was your workout?"
                required
              />
            </div>

            {type === 'running' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="fitness-input w-full"
                  step="0.01"
                  min="0"
                  placeholder="How far did you run?"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="fitness-input w-full"
                rows={3}
                placeholder="Add details about your workout"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => navigate('/workouts')}
                className="fitness-button border border-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="fitness-button-primary">
                Save Workout
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWorkout;
