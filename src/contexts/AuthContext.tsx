
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Define user type
export type User = {
  id: string;
  username: string;
  profileData?: {
    height?: number;
    weight?: number;
    age?: number;
    gender?: string;
  };
};

// Define context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  logout: () => void;
  updateProfile: (profileData: User['profileData']) => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, we would use a secure API for authentication
// For now, we're using localStorage for demonstration
const USERS_STORAGE_KEY = 'fitness-tracker-users';
const CURRENT_USER_KEY = 'fitness-tracker-current-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { username: string; password: string; userData: User }> => {
    const usersString = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersString) return {};
    try {
      return JSON.parse(usersString);
    } catch (error) {
      console.error('Failed to parse users:', error);
      return {};
    }
  };

  const saveUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
  };

  const register = (username: string, password: string) => {
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }

    const users = getUsers();
    if (users[username]) {
      toast.error('Username already exists');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      profileData: {
        height: 0,
        weight: 0,
        age: 0,
        gender: '',
      },
    };

    // Save to "database"
    users[username] = {
      username,
      password, // In a real app, this would be hashed
      userData: newUser,
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Log them in
    saveUser(newUser);
    toast.success('Registration successful!');
  };

  const login = (username: string, password: string) => {
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }

    const users = getUsers();
    const userRecord = users[username];

    if (!userRecord || userRecord.password !== password) {
      toast.error('Invalid username or password');
      return;
    }

    saveUser(userRecord.userData);
    toast.success('Login successful!');
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (profileData: User['profileData']) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      profileData: {
        ...user.profileData,
        ...profileData,
      },
    };

    // Update in "database"
    const users = getUsers();
    if (users[user.username]) {
      users[user.username].userData = updatedUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    saveUser(updatedUser);
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
