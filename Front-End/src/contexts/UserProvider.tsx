import { useContext, createContext } from 'react';
import { useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const API_URL = 'http://localhost:3000/User';

    const getUser = async () => {
        try {
            const response = await fetch(
                `${API_URL}/1`,
                {
                    // credentials: 'include',
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const result = await response.json();
            if (result) {
                setUser(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <UserContext.Provider value={{ getUser, user }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}
