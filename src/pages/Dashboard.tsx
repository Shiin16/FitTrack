
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFitnessData } from '../contexts/FitnessDataContext';
import { Calendar, Dumbbell, Target, TrendingUp, Utensils } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { format, subDays, isToday, parseISO } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { workouts, meals, goals } = useFitnessData();

  // Get today's date as a string in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Filter workouts to last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  // Process workout data for charts
  const workoutData = last7Days.map(date => {
    const dayWorkouts = workouts.filter(w => w.date === date);
    return {
      date: format(parseISO(date), 'MMM dd'),
      minutes: dayWorkouts.reduce((total, w) => total + w.duration, 0),
      count: dayWorkouts.length,
    };
  });

  // Process nutrition data for charts
  const nutritionData = last7Days.map(date => {
    const dayMeals = meals.filter(m => m.date === date);
    return {
      date: format(parseISO(date), 'MMM dd'),
      calories: dayMeals.reduce((total, m) => total + m.calories, 0),
      protein: dayMeals.reduce((total, m) => total + m.protein, 0),
    };
  });

  // Get today's totals
  const todayWorkouts = workouts.filter(w => w.date === today);
  const todayMeals = meals.filter(m => m.date === today);
  
  const todayStats = {
    workoutMinutes: todayWorkouts.reduce((total, w) => total + w.duration, 0),
    workoutCount: todayWorkouts.length,
    calories: todayMeals.reduce((total, m) => total + m.calories, 0),
    protein: todayMeals.reduce((total, m) => total + m.protein, 0),
    carbs: todayMeals.reduce((total, m) => total + m.carbs, 0),
    fat: todayMeals.reduce((total, m) => total + m.fat, 0),
  };

  // Get active goals
  const activeGoals = goals.filter(goal => {
    const endDate = new Date(goal.endDate);
    return endDate >= new Date();
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your fitness summary for today
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Link to="/workouts/add" className="fitness-button-primary">
            Log Workout
          </Link>
          <Link to="/nutrition/add" className="fitness-button-secondary">
            Log Meal
          </Link>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Calendar className="mr-2 h-5 w-5 text-fitness-primary" />
          Today's Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="fitness-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{todayStats.workoutCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {todayStats.workoutMinutes} minutes
                  </p>
                </div>
                <Dumbbell className="h-8 w-8 text-fitness-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{todayStats.calories}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">kcal consumed</p>
                </div>
                <Utensils className="h-8 w-8 text-fitness-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{todayStats.protein}g</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    C: {todayStats.carbs}g | F: {todayStats.fat}g
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-fitness-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="fitness-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">in progress</p>
                </div>
                <Target className="h-8 w-8 text-fitness-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="fitness-card">
          <CardHeader>
            <div className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-fitness-primary" />
              <CardTitle>Workout Activity</CardTitle>
            </div>
            <CardDescription>Your workout duration over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="minutes" name="Minutes" fill="#8B5CF6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="fitness-card">
          <CardHeader>
            <div className="flex items-center">
              <Utensils className="mr-2 h-5 w-5 text-fitness-primary" />
              <CardTitle>Nutrition Tracking</CardTitle>
            </div>
            <CardDescription>Your calorie intake over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  name="Calories"
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
            <Target className="mr-2 h-5 w-5 text-fitness-primary" />
            Active Goals
          </h2>
          <Link 
            to="/goals/add" 
            className="text-sm text-fitness-primary hover:text-fitness-secondary font-medium"
          >
            Add Goal
          </Link>
        </div>
        
        {activeGoals.length === 0 ? (
          <Card className="fitness-card">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">You don't have any active goals yet.</p>
              <Link 
                to="/goals/add" 
                className="fitness-button-primary inline-block mt-4"
              >
                Create Your First Goal
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.slice(0, 4).map((goal) => (
              <Card key={goal.id} className="fitness-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{goal.title}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-fitness-primary h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(goal.startDate), 'MMM d')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
