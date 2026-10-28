import { useContext, createContext } from 'react';
import { useState } from 'react';

const SafetyInspectionContext = createContext(null);

export const SafetyInspectionProvider = ({ children }) => {

    const API_URL = 'http://localhost:8000/api/safetyInspection';

    const [safetyList, setSafetyList] = useState([]);

    const getSafetyInspections = async (vehicleId) => {
        try {
            const response = await fetch(
                `${API_URL}/all/${vehicleId}`,
                {
                    credentials: 'include',
                    method: "Get",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const safetyInspectionList = await response.json();
            if (response.ok) {

                // const itemsToKeep = [safetyInspectionList[0], safetyInspectionList[1]];

                setSafetyList(safetyInspectionList.safetyInspections);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const getSafetyInspectionsNotDone = async () => {
        try {
            const response = await fetch(
                `${API_URL}/allNotDoneFromEveryVehicle`,
                {
                    credentials: 'include',
                    method: "Get",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const safetyInspectionList = await response.json();
            if (response.ok) {

                // const itemsToKeep = [safetyInspectionList[0], safetyInspectionList[1]];

                setSafetyList(safetyInspectionList.safetyInspections);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const updateSafetyInspections = async (vehicleId, safetyId, data) => {
        try {
            const response = await fetch(
                `${API_URL}/update/${vehicleId}/${safetyId}`,
                {
                    credentials: 'include',
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );
            const res = await response.json();
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    const validateSafetyInspections = async (vehicleId, safetyId, data) => {
        try {
            const response = await fetch(
                `${API_URL}/validate/${vehicleId}/${safetyId}`,
                {
                    credentials: 'include',
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

    // const deleteSafetyInspections = async (vehicleId, safetyId, data) => {
    //     try {
    //         const response = await fetch(
    //             `${API_URL}/${vehicleId}/${safetyId}`,
    //             {
    //                 // credentials: 'include',
    //                 method: "DELETE",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 }
    //             }
    //         );
    //         const res = await response.json();
    //         console.log(res);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const safetyInspectionYes = async (vehicleId, doneAt, valid) => {

        try {
            const response = await fetch(
                `${API_URL}/addDone/${vehicleId}`,
                {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ doneAt, valid })
                }
            );
            if (response.ok) {
                getSafetyInspectionsNotDone();
            }

        } catch (error) {
            console.log(error);
        }
    }

    const safetyInspectionNo = async (vehicleId) => {
        try {
            const response = await fetch(
                `${API_URL}/addFirst/${vehicleId}`,
                {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                getSafetyInspectionsNotDone();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafetyInspectionContext.Provider value={{ getSafetyInspections, safetyList, safetyInspectionYes, safetyInspectionNo, getSafetyInspectionsNotDone }}>
            {children}
        </SafetyInspectionContext.Provider>
    );
}

export const useSafety = () => {
    return useContext(SafetyInspectionContext);
}