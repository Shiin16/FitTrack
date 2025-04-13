
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFitnessData, Meal } from '../contexts/FitnessDataContext';
import { format, parseISO, startOfWeek, endOfWeek, addDays, isWithinInterval } from 'date-fns';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card';
import { Calendar, PieChart as PieChartIcon, Trash2, Utensils } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';

const Nutrition = () => {
  const { meals, deleteMeal } = useFitnessData();
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sort meals by date (most recent first) and mealType
  const sortedMeals = [...meals].sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    const mealTypeOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
    return mealTypeOrder[a.mealType] - mealTypeOrder[b.mealType];
  });

  // Filter meals based on selected time frame
  const getFilteredMeals = () => {
    const today = new Date(selectedDate);
    
    if (timeFrame === 'day') {
      return sortedMeals.filter(meal => meal.date === selectedDate);
    } else if (timeFrame === 'week') {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      
      return sortedMeals.filter(meal => {
        const mealDate = new Date(meal.date);
        return isWithinInterval(mealDate, { start: weekStart, end: weekEnd });
      });
    } else {
      // Month view - get current month
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return sortedMeals.filter(meal => {
        const mealDate = new Date(meal.date);
        return isWithinInterval(mealDate, { start: monthStart, end: monthEnd });
      });
    }
  };

  const filteredMeals = getFilteredMeals();

  // Calculate nutrition totals for the filtered meals
  const nutritionTotals = filteredMeals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Data for macronutrient distribution pie chart
  const macroData = [
    { name: 'Protein', value: nutritionTotals.protein, color: '#8B5CF6' },
    { name: 'Carbs', value: nutritionTotals.carbs, color: '#F97316' },
    { name: 'Fat', value: nutritionTotals.fat, color: '#10B981' },
  ];

  // Data for calories by meal type
  const caloriesByMealType = filteredMeals.reduce<Record<string, number>>((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = 0;
    }
    acc[meal.mealType] += meal.calories;
    return acc;
  }, {});

  const mealTypeData = Object.entries(caloriesByMealType).map(([type, calories]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    calories,
  }));

  // Get day-by-day data for bar chart (when in week view)
  const getDailyData = () => {
    const today = new Date(selectedDate);
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayMeals = meals.filter(meal => meal.date === dateStr);
      
      return {
        day: format(date, 'EEE'),
        calories: dayMeals.reduce((total, meal) => total + meal.calories, 0),
      };
    });
  };

  // Format for displaying meal time
  const getMealTypeIcon = (type: Meal['mealType']) => {
    const colors = {
      breakfast: 'text-yellow-500',
      lunch: 'text-blue-500',
      dinner: 'text-purple-500',
      snack: 'text-green-500',
    };
    
    return <Utensils className={`h-5 w-5 ${colors[type]}`} />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Utensils className="mr-2 h-7 w-7 text-fitness-primary" />
            Nutrition
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your meals and monitor your macros
          </p>
        </div>
        <Link to="/nutrition/add" className="fitness-button-primary mt-4 md:mt-0">
          Log Meal
        </Link>
      </div>

      {/* Time Frame and Date Selection */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeFrame('day')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeFrame === 'day' 
                ? 'bg-fitness-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setTimeFrame('week')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeFrame === 'week' 
                ? 'bg-fitness-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeFrame('month')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeFrame === 'month' 
                ? 'bg-fitness-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Month
          </button>
        </div>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="fitness-input"
          />
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Nutrition Summary
        </h2>
        
        {filteredMeals.length === 0 ? (
          <Card className="fitness-card p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No meal data available for the selected time period.</p>
            <Link 
              to="/nutrition/add" 
              className="fitness-button-primary inline-block mt-4"
            >
              Log Your First Meal
            </Link>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="fitness-card">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories</div>
                  <div className="text-2xl font-bold mt-1">{nutritionTotals.calories}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
                </CardContent>
              </Card>
              
              <Card className="fitness-card">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</div>
                  <div className="text-2xl font-bold mt-1">{nutritionTotals.protein}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">grams</div>
                </CardContent>
              </Card>
              
              <Card className="fitness-card">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbs</div>
                  <div className="text-2xl font-bold mt-1">{nutritionTotals.carbs}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">grams</div>
                </CardContent>
              </Card>
              
              <Card className="fitness-card">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat</div>
                  <div className="text-2xl font-bold mt-1">{nutritionTotals.fat}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">grams</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Macronutrient Distribution */}
              <Card className="fitness-card">
                <CardHeader>
                  <div className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5 text-fitness-primary" />
                    <CardTitle>Macronutrient Distribution</CardTitle>
                  </div>
                  <CardDescription>Breakdown of your macros (in grams)</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}g`}
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Calories Chart */}
              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle>
                    {timeFrame === 'day' ? 'Calories by Meal Type' : 'Daily Calories'}
                  </CardTitle>
                  <CardDescription>
                    {timeFrame === 'day' 
                      ? 'Distribution of calories across meal types' 
                      : 'Calorie intake over time'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {timeFrame === 'day' ? (
                      <BarChart data={mealTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="calories" name="Calories" fill="#8B5CF6" />
                      </BarChart>
                    ) : (
                      <BarChart data={getDailyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="calories" name="Calories" fill="#8B5CF6" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Meal History */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Calendar className="mr-2 h-5 w-5 text-fitness-primary" />
          Meal Log
        </h2>
        
        {sortedMeals.length === 0 ? (
          <Card className="fitness-card p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">You haven't logged any meals yet.</p>
            <Link 
              to="/nutrition/add" 
              className="fitness-button-primary inline-block mt-4"
            >
              Log Your First Meal
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} className="fitness-card">
                <div className="p-4 flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      {getMealTypeIcon(meal.mealType)}
                    </div>
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{meal.mealType}</span>
                        <span className="mx-2">•</span>
                        <span>{format(parseISO(meal.date), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex mt-2 text-sm text-gray-600 dark:text-gray-400 space-x-3">
                        <div>{meal.calories} kcal</div>
                        <div>P: {meal.protein}g</div>
                        <div>C: {meal.carbs}g</div>
                        <div>F: {meal.fat}g</div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteMeal(meal.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Delete meal"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
