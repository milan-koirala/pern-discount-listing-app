import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("shop"));
    if (storedToken && storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (token, shopData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("shop", JSON.stringify(shopData));
    setUser(shopData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shop");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
