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
      const response = await fetch("http://localhost:8000/api/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }
      const meResponse = await fetch("http://localhost:8000/api/user", {
        credentials: "include",
        method: "GET",
      });
      if (!meResponse.ok) {
        throw new Error("Failed to fetch user");
      }
      const res = await meResponse.json();
      setUser(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
