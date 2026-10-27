import { Route, Routes } from "react-router";
// import ProtectedRoute from "./composants/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Vehicle from "./pages/Vehicle";
import Signin from "./pages/SignIn";
import Login from "./pages/LoginUser";
import IsAuthenticated from "./utility/IsAuthenticated";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />

            <Route path="/dashboard/:uuid" element={<Dashboard />} />
            <Route path="/vehicle/:uuid" element={<Vehicle />} />

        </Routes>
    );
}

export default AppRoutes;

