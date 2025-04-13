
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Utensils, Target, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/workouts', label: 'Workouts', icon: BarChart3 },
    { path: '/nutrition', label: 'Nutrition', icon: Utensils },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (!isAuthenticated) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="fitness-button-secondary"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="fitness-button-primary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path) 
                    ? "text-fitness-primary bg-fitness-light bg-opacity-50" 
                    : "text-gray-600 hover:text-fitness-primary hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-1.5 h-4 w-4" />
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </button>
          </div>
          
          {/* Mobile menu button - would implement toggle */}
          <div className="flex items-center md:hidden">
            {/* Mobile menu implementation would go here */}
          </div>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-10">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center transition-colors",
                isActive(item.path) 
                  ? "text-fitness-primary" 
                  : "text-gray-500 hover:text-fitness-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
