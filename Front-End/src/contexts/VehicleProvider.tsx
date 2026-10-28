import { useContext, createContext, useState } from 'react';


export interface Vehicle {
    id: string | number;
    brand: string;
    model: string;
    registrationNumber?: string;
    version?: string;
    typeOfFuel?: string;
    mileage?: number;
}

interface VehicleContextType {
    vehicles: Vehicle[];
    getVehicle: () => Promise<void>;
    addVehicle: (data: Omit<Vehicle, 'id'>) => Promise<void>;
    updateVehicle: (id: Vehicle['id'], data: Partial<Omit<Vehicle, 'id'>>) => Promise<void>;
    deleteVehicle: (id: Vehicle['id']) => Promise<void>;
}

const API_URL = 'http://localhost:8000/api/vehicle';

const VehicleContext = createContext<VehicleContextType | null>(null);

export const VehicleProvider = ({ children }) => {

    const [vehicles, setVehicle] = useState<Vehicle[]>([]);

    const getVehicle = async () => {

        try {
            const response = await fetch(
                `${API_URL}/all`);

            const result = await response.json();
            if (result) {
                setVehicle(result);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addVehicle = async (data: Omit<Vehicle, 'id'>) => {
        try {
            const response = await fetch(`${API_URL}/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setVehicle((actual) => [...actual, result]);
                return result
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateVehicle = async (id: Vehicle['id'], data: Partial<Omit<Vehicle, 'id'>>) => {
        try {
            const response = await fetch(`${API_URL}/update/${id}`, {
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
                method: 'DELETE',
            });
            if (response.ok) {
                setVehicle((actual) => actual.filter((v) => v.id !== id));
            }
        } catch (error) {
            console.log(error);
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