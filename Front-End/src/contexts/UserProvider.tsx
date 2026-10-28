import { useContext, createContext } from 'react';
import { useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const API_URL = 'http://localhost:8000/api/user';

    const getUser = async () => {
        try {
            const response = await fetch(
                `${API_URL}`,
                {
                    credentials: 'include',
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
