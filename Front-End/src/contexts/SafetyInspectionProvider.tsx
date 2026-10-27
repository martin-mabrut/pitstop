import { useContext, createContext } from 'react';
import { useState } from 'react';

const SafetyInspectionContext = createContext(null);

export const SafetyInspectionProvider = ({ children }) => {

    const [safetyList, setSafetyList] = useState([]);

    const getSafetyInspections = async () => {
        try {
            const response = await fetch(
                'http://localhost:3000/safetyInspection/',
                {
                    // credentials: 'include',
                    method: "Get",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const safetyInspectionList = await response.json();
            console.log(safetyInspectionList);
            if (safetyInspectionList) {

                // const itemsToKeep = [safetyInspectionList[0], safetyInspectionList[1]];

                setSafetyList(safetyInspectionList);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const updateSafetyInspections = async (data, id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/safetyInspection/${id}`,
                {
                    // credentials: 'include',
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );
            const res = await response.json();
            console.log(res);

            // if (response) {

            //     // const itemsToKeep = [safetyInspectionList[0], safetyInspectionList[1]];

            //     setSafetyList(safetyInspectionList);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteSafetyInspections = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/safetyInspection/${id}`,
                {
                    // credentials: 'include',
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const res = await response.json();
            console.log(res);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafetyInspectionContext.Provider value={{ getSafetyInspections, safetyList }}>
            {children}
        </SafetyInspectionContext.Provider>
    );
}

export const useSafety = () => {
    return useContext(SafetyInspectionContext);
}