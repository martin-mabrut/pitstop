import { useContext, createContext } from 'react';
import { useState } from 'react';

const RepairsContext = createContext(null);

export const RepairsProvider = ({ children }) => {

    const [repairsList, setRepairsList] = useState([]);

    const getRepairs = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/repairs`,
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

    return (
        <RepairsContext.Provider value={{ getRepairs, repairsList }}>
            {children}
        </RepairsContext.Provider>
    );
}

export const useRepairs = () => {
    return useContext(RepairsContext);
}
