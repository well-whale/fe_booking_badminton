import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { routes } from './routes';
import { selectUser } from '../redux/userSlice';

const ProtectedRoute = ({ children, role }) => {
    const user = useSelector(selectUser).user;
    if (!user || !user.role.roleName) {
        return <Navigate to={routes.login} />;
    }
    if (user.role.roleName !== role) {
        return <Navigate to={routes.login} />;
    }
    return children;
};

export default ProtectedRoute;
