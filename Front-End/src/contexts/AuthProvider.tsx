// /contexts/AuthProvider.jsx
import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);
const TOKEN = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem(TOKEN));

  const signin = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result) {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/api/login_check", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result) {
        setUser(result);
        //rajouer.user
        localStorage.setItem(TOKEN, JSON.stringify(result.token));
        console.log(user);
        console.log(result);
      }
      throw new Error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
