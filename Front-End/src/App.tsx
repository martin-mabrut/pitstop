import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthProvider'
import AppRoutes from './AppRoutes'
import { VehicleProvider } from './contexts/VehicleProvider'
import { SafetyInspectionProvider } from './contexts/SafetyInspectionProvider'
import Navbar from './components/Navbar/Navbar'
import { UserProvider } from './contexts/UserProvider'
import { RepairsProvider } from './contexts/RepairsProvider'


function App() {



  return (
    <>
      <div>
        <AuthProvider>
          <UserProvider>
          <SafetyInspectionProvider>
          <RepairsProvider>
            <VehicleProvider>
              <BrowserRouter>
                <Navbar />
                <AppRoutes />
              </BrowserRouter>
            </VehicleProvider>
          </RepairsProvider>
          </SafetyInspectionProvider>
          </UserProvider>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
