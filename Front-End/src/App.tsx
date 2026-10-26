import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthProvider'
import AppRoutes from './AppRoutes'
import { VehicleProvider } from './contexts/VehicleProvider'
import { SafetyInspectionProvider } from './contexts/SafetyInspectionProvider'


function App() {



  return (
    <>
      <div>
        <AuthProvider>
          <SafetyInspectionProvider>
            <VehicleProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </VehicleProvider>
          </SafetyInspectionProvider>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
