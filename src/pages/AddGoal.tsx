
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitnessData } from '../contexts/FitnessDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

const AddGoal = () => {
  const navigate = useNavigate();
  const { addGoal } = useFitnessData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'distance' | 'workout' | 'weight' | 'custom'>('distance');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('km');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  
  // Set default units based on type
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
    
    switch (newType) {
      case 'distance':
        setUnit('km');
        break;
      case 'workout':
        setUnit('sessions');
        break;
      case 'weight':
        setUnit('kg');
        break;
      default:
        setUnit('');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addGoal({
      title,
      description,
      type,
      target: Number(target),
      current: 0,
      unit,
      startDate,
      endDate,
    });
    
    navigate('/goals');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Target className="mr-2 h-7 w-7 text-fitness-primary" />
          Set New Goal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a fitness goal to track your progress
        </p>
      </div>

      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Goal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="fitness-input w-full"
                placeholder="e.g., Run 50km this month"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="fitness-input w-full"
                rows={2}
                placeholder="Add details about your goal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Type
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="fitness-input w-full"
                required
              >
                <option value="distance">Distance</option>
                <option value="workout">Workout Frequency</option>
                <option value="weight">Weight Change</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="fitness-input w-full"
                  min="0"
                  step="0.01"
                  placeholder="Your target amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="fitness-input w-full"
                  placeholder="e.g., km, sessions, kg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="fitness-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="fitness-input w-full"
                  min={startDate}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="fitness-button border border-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="fitness-button-primary">
                Create Goal
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddGoal;
