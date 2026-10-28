import { useContext, createContext, useState, type ReactNode } from 'react';

export interface Repair {
    id: string | number;
    vehicleId: string | number;
    typeOfRepairs: string;
    repairedAt: string;
    description: string;
    price: number;
}

type RepairData = Omit<Repair, 'id' | 'vehicleId'>;

interface RepairsContextType {
    repairsList: Repair[];
    getRepairs: (vehicleId: string | number) => Promise<void>;
    addRepair: (vehicleId: string | number, data: RepairData) => Promise<void>;
    modifyRepair: (vehicleId: string | number, repairId: Repair['id'], data: Partial<RepairData>) => Promise<void>;
    deleteRepair: (vehicleId: string | number, repairId: Repair['id']) => Promise<void>;
}

const API_URL = 'http://localhost:8000/api/repairs';

const RepairsContext = createContext<RepairsContextType | null>(null);

export function RepairsProvider({ children }: { children: ReactNode }) {

    const [repairsList, setRepairsList] = useState<Repair[]>([]);

    async function getRepairs(vehicleId: string | number) {
        try {
            const response = await fetch(
                `${API_URL}/all/${vehicleId}`,
                {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const result = await response.json();
            if (response.ok) {
                setRepairsList(result.repairs);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function addRepair(vehicleId: string | number, data: RepairData) {
        try {
            const response = await fetch(
                `${API_URL}/add/${vehicleId}`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );
            if (response.ok) {
                getRepairs(vehicleId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function modifyRepair(vehicleId: string | number, repairId: Repair['id'], data: Partial<RepairData>) {
        try {
            const response = await fetch(
                `${API_URL}/update/${vehicleId}/${repairId}`,
                {
                    credentials: "include",
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );
            if (response.ok) {
                getRepairs(vehicleId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteRepair(vehicleId: string | number, repairId: Repair['id']) {
        try {
            const response = await fetch(
                `${API_URL}/delete/${vehicleId}/${repairId}`,
                {
                    credentials: "include",
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                getRepairs(vehicleId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RepairsContext.Provider
            value={{ repairsList, getRepairs, addRepair, modifyRepair, deleteRepair }}
        >
            {children}
        </RepairsContext.Provider>
    );
}

export function useRepairs() {
    const context = useContext(RepairsContext);
    if (!context) {
        throw new Error('useRepairs doit être utilisé dans un RepairsProvider');
    }
    return context;
}
