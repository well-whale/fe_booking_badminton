import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { routes } from './routes';
import { selectUser } from '../redux/userSlice';

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector(selectUser);
  if (!user || !user.role) {
    return <Navigate to={routes.login} />;
  }
  if (user.role !== role) {
    return <Navigate to={routes.home} />;
  }
  return children;
};

export default ProtectedRoute;
