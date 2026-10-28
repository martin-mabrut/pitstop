
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

export interface Vehicle {
    id: string | number;
    uuid?: string;
    vehicleType: string;
    registrationNumber: string;
    brand: string;
    model: string;
    version: string | null;
    firstRegistrationDateAt: string;
    typeOfFuel: string;
    typeOfTransmission: string;
    mileage: number | null;
    kmPerDay: number | null;
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

interface VehicleProviderProps {
    children: ReactNode;
}

export function VehicleProvider({ children }: VehicleProviderProps) {
    const [vehicles, setVehicle] = useState<Vehicle[]>([]);

    const getVehicle = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/all`, {
                method: 'GET',
                credentials: 'include',
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!Array.isArray(result.vehicles)) {
                throw new Error(
                    "La réponse de l'API ne contient pas de liste de véhicules."
                );
            }

            const receivedVehicles: Vehicle[] = result.vehicles;

            receivedVehicles.forEach((vehicle) => {
                if (vehicle.id == null) {
                    console.error(
                        'ID absent de la réponse Symfony. Vérifie les groupes de sérialisation :',
                        vehicle
                    );
                }
            });

            setVehicle(receivedVehicles);
        } catch (error) {
            console.error('Erreur getVehicle :', error);
        }
    };

    const addVehicle = async (
        data: Omit<Vehicle, 'id'>
    ): Promise<Vehicle | undefined> => {
        try {
            const response = await fetch(`${API_URL}/add/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Erreur lors de l'ajout du véhicule"
                );
            }

            const createdVehicle: Vehicle = result.vehicle;

            if (createdVehicle?.id == null) {
                throw new Error(
                    "Le véhicule a été créé, mais l'API n'a pas renvoyé son ID."
                );
            }

            setVehicle((current) => [
                ...current,
                createdVehicle,
            ]);

            return createdVehicle;
        } catch (error) {
            console.error('Erreur addVehicle :', error);
            return undefined;
        }
    };

    const updateVehicle = async (
        id: Vehicle['id'],
        data: Partial<Omit<Vehicle, 'id'>>
    ): Promise<void> => {
        try {
            const response = await fetch(
                `${API_URL}/update/${encodeURIComponent(String(id))}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Erreur lors de la modification du véhicule'
                );
            }

            const updatedVehicle: Vehicle = result.vehicle;

            setVehicle((current) =>
                current.map((vehicle) =>
                    String(vehicle.id) === String(id)
                        ? updatedVehicle
                        : vehicle
                )
            );
        } catch (error) {
            console.error('Erreur updateVehicle :', error);
            throw error;
        }
    };

    const deleteVehicle = async (
        id: Vehicle['id']
    ): Promise<boolean> => {
        try {
            const response = await fetch(
                `${API_URL}/delete/${encodeURIComponent(String(id))}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erreur HTTP ${response.status} lors de la suppression`
                );
            }

            setVehicle((current) =>
                current.filter(
                    (vehicle) => String(vehicle.id) !== String(id)
                )
            );

            return true;
        } catch (error) {
            console.error('Erreur deleteVehicle :', error);
            return false;
        }
    };

    return (
        <VehicleContext.Provider
            value={{
                vehicles,
                getVehicle,
                addVehicle,
                updateVehicle,
                deleteVehicle,
            }}
        >
            {children}
        </VehicleContext.Provider>
    );
}

export function useVehicle(): VehicleContextType {
    const context = useContext(VehicleContext);

    if (!context) {
        throw new Error(
            'useVehicle doit être utilisé dans un VehicleProvider'
        );
    }

    return context;
}
