import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthProvider'
import AppRoutes from './AppRoutes'

function App() {

  async function listGarageFromBackend() {
    const garage = await fetch('http://localhost:8000/garage');
    const data = await garage.json();
    console.log(data.garage[0]);
  }

  async function listVehicleFromFakeapi() {
    const garage = await fetch('http://localhost:3000/vehicle');
    const data = await garage.json();
    console.log(data);
  }

  listGarageFromBackend();
  listVehicleFromFakeapi();

  return (
    <>
      <div>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
