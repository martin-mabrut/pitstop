import { useContext, createContext } from 'react';
import { useState } from 'react';

const RepairsContext = createContext(null);

export const RepairsProvider = ({ children }) => {

    const API_URL = 'http://localhost:3000/repairs';

    const [repairsList, setRepairsList] = useState([]);

    const getRepairs = async (vehicleId) => {
        try {
            const response = await fetch(
                `${API_URL}/${vehicleId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const result = await response.json();
            if (result) {
                setRepairsList(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addRepair = async (vehicleId, data) => {
        try {
            const response = await fetch(
                `${API_URL}/${vehicleId}`,
                {
                    // credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: data
                }
            );
            const result = await response.json();
            if (result) {
                setRepairsList(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const modifyRepair = async (vehicleId, repairId, data) => {
        try {
            const response = await fetch(
                `${API_URL}/${vehicleId}/${repairId}`,
                {
                    // credentials: "include",
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: data
                }
            );
            const result = await response.json();
            if (result) {
                setRepairsList(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteRepair = async (vehicleId, repairId) => {
        try {
            const response = await fetch(
                `${API_URL}/${vehicleId}/${repairId}`,
                {
                    // credentials: "include",
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const result = await response.json();
            if (result) {
                setRepairsList(result);
            }
        } catch (error) {
            console.log(error);
        }
    }





    return (
        <RepairsContext.Provider value={{ getRepairs, repairsList }}>
            {children}
        </RepairsContext.Provider>
    );
}

export const useRepairs = () => {
    return useContext(RepairsContext);
}
