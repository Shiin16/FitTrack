
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitnessData } from '../contexts/FitnessDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';

const AddMeal = () => {
  const navigate = useNavigate();
  const { addMeal } = useFitnessData();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMeal({
      date,
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      mealType,
    });
    
    navigate('/nutrition');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Utensils className="mr-2 h-7 w-7 text-fitness-primary" />
          Log Meal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Record what you ate
        </p>
      </div>

      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Meal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="fitness-input w-full"
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="fitness-input w-full"
                placeholder="e.g., Grilled Chicken Salad"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calories
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="fitness-input w-full"
                min="0"
                placeholder="Total calories"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="fitness-input w-full"
                  min="0"
                  step="0.1"
                  placeholder="Protein"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="fitness-input w-full"
                  min="0"
                  step="0.1"
                  placeholder="Carbohydrates"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="fitness-input w-full"
                  min="0"
                  step="0.1"
                  placeholder="Fat"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => navigate('/nutrition')}
                className="fitness-button border border-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="fitness-button-primary">
                Save Meal
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMeal;
