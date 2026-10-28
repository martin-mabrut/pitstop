
import { Route, Routes } from 'react-router';

import Dashboard from './pages/Dashboard';
import Vehicle from './pages/Vehicle';
import Signin from './pages/SignIn';
import Login from './pages/LoginUser';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:uuid" element={<Dashboard />} />
            <Route path="/vehicle/:uuid" element={<Vehicle />} />
        </Routes>
    );
}
