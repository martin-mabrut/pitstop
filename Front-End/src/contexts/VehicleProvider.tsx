import { useContext, createContext, useState } from 'react';


export interface Vehicle {
    id: string | number;
    uid?: string;
    vehicleType: string;
    registrationNumber: string;
    brand: string;
    model: string;
    version: string;
    firstRegistrationDateAt: string;
    typeOfFuel: string;
    typeOfTransmission: string;
    mileage: number;
    kmPerDay: number;
    userId?: number;
}

interface VehicleContextType {
    vehicles: Vehicle[];
    getVehicle: () => Promise<void>;
    addVehicle: (data: Omit<Vehicle, 'id'>) => Promise<Vehicle | undefined>;
    updateVehicle: (id: Vehicle['id'], data: Partial<Omit<Vehicle, 'id'>>) => Promise<void>;
    deleteVehicle: (id: Vehicle['id']) => Promise<boolean>;
}

const API_URL = 'http://localhost:8000/api/vehicle';

const VehicleContext = createContext<VehicleContextType | null>(null);

export const VehicleProvider = ({ children }) => {

    const [vehicles, setVehicle] = useState<Vehicle[]>([]);

    const getVehicle = async () => {

        try {
            const response = await fetch(
                `${API_URL}/all`, {
                credentials: "include"
            });

            const result = await response.json();
            if (response.ok) {
                setVehicle(result.vehicles);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addVehicle = async (data: Omit<Vehicle, 'id'>) => {
        try {
            const response = await fetch(`${API_URL}/add/`, {
                credentials: "include",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                getVehicle();
                return result.vehicle;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateVehicle = async (id: Vehicle['id'], data: Partial<Omit<Vehicle, 'id'>>) => {
        try {
            const response = await fetch(`${API_URL}/update/${id}`, {
                credentials: "include",
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setVehicle((actual) => actual.map((v) => (v.id === id ? result : v)));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteVehicle = async (id: Vehicle['id']) => {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                credentials: "include",
                method: 'DELETE'
            });
            if (response.ok) {
                setVehicle((actual) => actual.filter((v) => v.id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return (
        <VehicleContext.Provider value={{ vehicles, getVehicle, addVehicle, updateVehicle, deleteVehicle }}>
            {children}
        </VehicleContext.Provider>
    );
}

export const useVehicle = () => {
    return useContext(VehicleContext);
}