// /contexts/AuthProvider.jsx
import { useContext, createContext, useState } from 'react';
import { Navigate } from 'react-router';

const AuthContext = createContext(null);
const USER_KEY = "user";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(localStorage.getItem(USER_KEY));

    const login = async () => {
        //Ajouter data en params
        try {
            const response = await fetch(
                'http://localhost:3000/User/1',
                {
                    method: "GET",
                    // headers: {
                    //     "Content-Type": "application/json",
                    // },
                    // body: JSON.stringify(data)
                }
            );
            const result = await response.json();
            if (result) {
                setUser(result)
                //rajouer.user
                localStorage.setItem(USER_KEY, JSON.stringify(result));
                console.log(user);
                <Navigate
                    to={`/Dashboard`}
                    replace
                />;
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
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}