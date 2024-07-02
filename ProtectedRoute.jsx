import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from './src/AppContext';

const ProtectedRoute = ({ children }) => {
    
  const {user, getTokens} = useAppContext();

  if (!user) {
    const tokens = getTokens();
    if(!tokens.jwtAccessToken && !tokens.jwtRefreshToken) return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;