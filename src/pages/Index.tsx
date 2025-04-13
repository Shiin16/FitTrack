
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return <Navigate to={isAuthenticated ? '/' : '/login'} />;
};

export default Index;
