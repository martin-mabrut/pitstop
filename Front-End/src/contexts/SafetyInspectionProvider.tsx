import { useContext, createContext } from 'react';
import { useState } from 'react';

const SafetyInspectionContext = createContext(null);

export const SafetyInspectionProvider = ({ children }) => {

    const [safetyList, setSafetyList] = useState([]);

    const safetyInspectionDashboard = async () => {
        try {
            const response = await fetch(
                'http://localhost:3000/safetyInspection',
                {
                    // credentials: 'include',
                    method: "Get",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const safetyInspectionList = await response.json();
            if (safetyInspectionList) {

                // const itemsToKeep = [safetyInspectionList[0], safetyInspectionList[1]];

                setSafetyList(safetyInspectionList);
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <SafetyInspectionContext.Provider value={{ safetyInspectionDashboard, safetyList }}>
            {children}
        </SafetyInspectionContext.Provider>
    );
}

export const useSafety = () => {
    return useContext(SafetyInspectionContext);
}