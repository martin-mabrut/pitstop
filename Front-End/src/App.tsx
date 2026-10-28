
import './App.css';
import { BrowserRouter } from 'react-router';

import { AuthProvider } from './contexts/AuthProvider';
import { UserProvider } from './contexts/UserProvider';
import { VehicleProvider } from './contexts/VehicleProvider';
import { SafetyInspectionProvider } from './contexts/SafetyInspectionProvider';
import { RepairsProvider } from './contexts/RepairsProvider';

import Navbar from './components/Navbar/Navbar';
import AppRoutes from './AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UserProvider>
                    <VehicleProvider>
                        <SafetyInspectionProvider>
                            <RepairsProvider>
                                <Navbar />
                                <AppRoutes />
                            </RepairsProvider>
                        </SafetyInspectionProvider>
                    </VehicleProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
