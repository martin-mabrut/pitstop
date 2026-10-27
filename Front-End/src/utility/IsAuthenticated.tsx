
import React from 'react'
import Fallback from '../pages/Fallback';
import { useAuth } from '../contexts/AuthProvider';
import { AuthProvider } from '../contexts/AuthProvider';

const IsAuthenticated = ({
    fallback = <Fallback />,
    children
}) => {

    const user = localStorage.getItem(user);

    if (user) {

        const { isAuthenticated } = { isAuthenticated: true };


        if (isAuthenticated) {
            return <>{children}</>;
        }
    }

    return <>{fallback}</>;
}

export default IsAuthenticated;