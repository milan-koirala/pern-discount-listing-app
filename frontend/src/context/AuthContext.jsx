import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ On initial load, check if backend verifies the token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/check-auth", {
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("shop");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("shop");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (token, shopData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("shop", JSON.stringify(shopData));
    setUser(shopData);
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("shop");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
