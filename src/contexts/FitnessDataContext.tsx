
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Define types
export type Workout = {
  id: string;
  date: string;
  type: 'calisthenics' | 'gym' | 'running' | 'other';
  duration: number; // in minutes
  description?: string;
  distance?: number; // in km, for running
};

export type Meal = {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  type: 'distance' | 'workout' | 'weight' | 'custom';
};

type FitnessData = {
  workouts: Workout[];
  meals: Meal[];
  goals: Goal[];
};

type FitnessDataContextType = {
  workouts: Workout[];
  meals: Meal[];
  goals: Goal[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalProgress: (goalId: string, increment: number) => void;
  deleteWorkout: (id: string) => void;
  deleteMeal: (id: string) => void;
  deleteGoal: (id: string) => void;
};

const FitnessDataContext = createContext<FitnessDataContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'fitness-tracker-data-';

export const FitnessDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setWorkouts([]);
      setMeals([]);
      setGoals([]);
    }
  }, [user]);

  const loadUserData = () => {
    if (!user) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${user.id}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (storedData) {
      try {
        const parsedData: FitnessData = JSON.parse(storedData);
        setWorkouts(parsedData.workouts || []);
        setMeals(parsedData.meals || []);
        setGoals(parsedData.goals || []);
      } catch (error) {
        console.error('Failed to parse fitness data:', error);
        toast.error('Failed to load your fitness data');
      }
    }
  };

  const saveUserData = () => {
    if (!user) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${user.id}`;
    const dataToSave: FitnessData = {
      workouts,
      meals,
      goals,
    };
    
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  };

  // Save data whenever it changes
  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [workouts, meals, goals, user]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    toast.success('Workout added successfully');
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
    };
    
    setMeals(prev => [...prev, newMeal]);
    toast.success('Meal added successfully');
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    
    setGoals(prev => [...prev, newGoal]);
    toast.success('Goal added successfully');
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, current: goal.current + increment } 
          : goal
      )
    );
    toast.success('Progress updated');
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
    toast.success('Workout deleted');
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    toast.success('Meal deleted');
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    toast.success('Goal deleted');
  };

  return (
    <FitnessDataContext.Provider
      value={{
        workouts,
        meals,
        goals,
        addWorkout,
        addMeal,
        addGoal,
        updateGoalProgress,
        deleteWorkout,
        deleteMeal,
        deleteGoal,
      }}
    >
      {children}
    </FitnessDataContext.Provider>
  );
};

export const useFitnessData = () => {
  const context = useContext(FitnessDataContext);
  if (context === undefined) {
    throw new Error('useFitnessData must be used within a FitnessDataProvider');
  }
  return context;
};
