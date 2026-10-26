// /contexts/AuthProvider.jsx
import { useContext, createContext, useState } from 'react';

const AuthContext = createContext(null);
const USER_KEY = "user";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(localStorage.getItem(USER_KEY));

    const signin = async (data) => {

        try {
            const response = await fetch(
                'http://localhost:3000/User',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );
            const result = await response.json();
            if (result) {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const login = async (data) => {

        try {
            const response = await fetch(
                'http://localhost:3000/User',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );
            const result = await response.json();
            if (result) {
                setUser(result)
                //rajouer.user
                localStorage.setItem(USER_KEY, JSON.stringify(result));
                console.log(user);
            }
            throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem(USER_KEY);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}