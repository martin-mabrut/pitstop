import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthProvider'
import AppRoutes from './AppRoutes'
import { VehicleProvider } from './contexts/VehicleProvider'


function App() {

  

  return (
    <>
      <div>
        <AuthProvider>
      <VehicleProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </VehicleProvider>
    </AuthProvider>
      </div>
    </>
  )
}

export default App
