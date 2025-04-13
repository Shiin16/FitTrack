
import React from 'react';
import { Link } from 'react-router-dom';
import { useFitnessData, Goal } from '../contexts/FitnessDataContext';
import { format, parseISO, isAfter } from 'date-fns';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card';
import { Award, Calendar, Clock, Dumbbell, Pencil, Ruler, Target, Trash2, TrendingUp } from 'lucide-react';

const Goals = () => {
  const { goals, updateGoalProgress, deleteGoal } = useFitnessData();

  // Split goals into active and completed
  const { activeGoals, completedGoals } = goals.reduce<{ activeGoals: Goal[], completedGoals: Goal[] }>(
    (acc, goal) => {
      if (goal.current >= goal.target || isAfter(new Date(), new Date(goal.endDate))) {
        acc.completedGoals.push(goal);
      } else {
        acc.activeGoals.push(goal);
      }
      return acc;
    },
    { activeGoals: [], completedGoals: [] }
  );

  // Function to get icon based on goal type
  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'distance':
        return <Ruler className="h-5 w-5 text-blue-500" />;
      case 'workout':
        return <Dumbbell className="h-5 w-5 text-purple-500" />;
      case 'weight':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Target className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Handler for updating progress
  const handleUpdateProgress = (goalId: string, value: string) => {
    const increment = Number(value);
    if (!isNaN(increment)) {
      updateGoalProgress(goalId, increment);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="mr-2 h-7 w-7 text-fitness-primary" />
            Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set, track, and achieve your fitness goals
          </p>
        </div>
        <Link to="/goals/add" className="fitness-button-primary mt-4 md:mt-0">
          Set New Goal
        </Link>
      </div>

      {/* Active Goals */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-fitness-primary" />
          Active Goals
        </h2>
        
        {activeGoals.length === 0 ? (
          <Card className="fitness-card p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">You don't have any active goals yet.</p>
            <Link 
              to="/goals/add" 
              className="fitness-button-primary inline-block mt-4"
            >
              Set Your First Goal
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map((goal) => (
              <Card key={goal.id} className="fitness-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                        {getGoalIcon(goal.type)}
                      </div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {goal.description && (
                    <CardDescription className="mt-1">{goal.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
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
                    
                    <div className="pt-3 flex items-center">
                      <div className="flex-1 mr-2">
                        <input
                          type="number"
                          className="fitness-input w-full text-sm"
                          placeholder={`Add ${goal.unit}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget;
                              handleUpdateProgress(goal.id, input.value);
                              input.value = '';
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling?.querySelector('input');
                          if (input) {
                            handleUpdateProgress(goal.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="fitness-button-secondary text-sm py-1.5"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
            <Award className="mr-2 h-5 w-5 text-fitness-primary" />
            Completed Goals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="fitness-card bg-gray-50 dark:bg-gray-800/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                        {getGoalIcon(goal.type)}
                      </div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded">
                      {goal.current >= goal.target ? 'Achieved' : 'Ended'}
                    </div>
                  </div>
                  {goal.description && (
                    <CardDescription className="mt-1">{goal.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Final Result</span>
                      <span className="font-medium">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          goal.current >= goal.target ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
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
        </div>
      )}
    </div>
  );
};

export default Goals;
