
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFitnessData, Workout } from '../contexts/FitnessDataContext';
import { format, parseISO } from 'date-fns';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card';
import { Calendar, Dumbbell, Play, Timer, Trash2, Weight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const Workouts = () => {
  const { workouts, deleteWorkout } = useFitnessData();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');

  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workouts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Function to get the date range based on the selected time frame
  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date();
    
    if (timeFrame === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else if (timeFrame === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    } else {
      startDate.setFullYear(today.getFullYear() - 1);
    }
    
    return { startDate, endDate: today };
  };

  // Filter workouts based on selected time frame
  const { startDate } = getDateRange();
  const filteredWorkouts = sortedWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= startDate;
  });

  // Data for workout duration by type
  const workoutsByType = filteredWorkouts.reduce<Record<string, { count: number; duration: number }>>((acc, workout) => {
    if (!acc[workout.type]) {
      acc[workout.type] = { count: 0, duration: 0 };
    }
    acc[workout.type].count += 1;
    acc[workout.type].duration += workout.duration;
    return acc;
  }, {});

  const pieChartData = Object.entries(workoutsByType).map(([type, data]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    value: data.count,
  }));

  const barChartData = Object.entries(workoutsByType).map(([type, data]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    duration: data.duration,
  }));

  // Function to get the icon based on workout type
  const getWorkoutIcon = (type: Workout['type']) => {
    switch (type) {
      case 'calisthenics':
        return <Play className="h-5 w-5 text-green-500" />;
      case 'gym':
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case 'running':
        return <Weight className="h-5 w-5 text-red-500" />;
      default:
        return <Timer className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Colors for pie chart
  const COLORS = ['#8B5CF6', '#F97316', '#10B981', '#3B82F6'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Dumbbell className="mr-2 h-7 w-7 text-fitness-primary" />
            Workouts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your exercise sessions
          </p>
        </div>
        <Link to="/workouts/add" className="fitness-button-primary mt-4 md:mt-0">
          Log Workout
        </Link>
      </div>

      {/* Analytics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Workout Analytics
          </h2>
          <div className="flex space-x-2">
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
            <button
              onClick={() => setTimeFrame('year')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFrame === 'year' 
                  ? 'bg-fitness-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {filteredWorkouts.length === 0 ? (
          <Card className="fitness-card p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No workout data available for the selected time period.</p>
            <Link 
              to="/workouts/add" 
              className="fitness-button-primary inline-block mt-4"
            >
              Log Your First Workout
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Duration by Type Chart */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle>Duration by Type</CardTitle>
                <CardDescription>Total minutes spent on each workout type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duration" name="Minutes" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Workout Distribution Chart */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle>Workout Distribution</CardTitle>
                <CardDescription>Breakdown of workout types</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ type }) => type}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Workout History */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Calendar className="mr-2 h-5 w-5 text-fitness-primary" />
          Workout History
        </h2>
        
        {sortedWorkouts.length === 0 ? (
          <Card className="fitness-card p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">You haven't logged any workouts yet.</p>
            <Link 
              to="/workouts/add" 
              className="fitness-button-primary inline-block mt-4"
            >
              Log Your First Workout
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedWorkouts.map((workout) => (
              <Card key={workout.id} className="fitness-card">
                <div className="p-4 flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      {getWorkoutIcon(workout.type)}
                    </div>
                    <div>
                      <h3 className="font-medium capitalize">{workout.type}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(parseISO(workout.date), 'MMMM d, yyyy')}
                      </p>
                      {workout.description && (
                        <p className="text-sm mt-1">{workout.description}</p>
                      )}
                      <div className="flex mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center mr-4">
                          <Timer className="h-4 w-4 mr-1" />
                          {workout.duration} minutes
                        </div>
                        {workout.distance && (
                          <div className="flex items-center">
                            <Weight className="h-4 w-4 mr-1" />
                            {workout.distance} km
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Delete workout"
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

export default Workouts;
