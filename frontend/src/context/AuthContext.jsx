// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "../utils/axiosInstance";
// import { useShopStore } from "../store/useShopStore";  // <-- Import your store here

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   // On initial load, verify token with backend
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get("/api/auth/check-auth", {
//           withCredentials: true,
//         });
//         if (res.data.success) {
//           setUser(res.data.data);
//         } else {
//           setUser(null);
//           localStorage.removeItem("token");
//           localStorage.removeItem("shop");
//         }
//       } catch (err) {
//         if (err.response?.status === 401) {
//           console.info("User is not authenticated");
//         } else {
//           console.error("Auth check failed", err);
//         }
//         setUser(null);
//         localStorage.removeItem("token");
//         localStorage.removeItem("shop");
//       } finally {
//         setAuthLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const login = (token, shopData) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("shop", JSON.stringify(shopData));
//     setUser(shopData);
//   };

//   const logout = async () => {
//     try {
//       await axios.post("/api/auth/logout", {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//     localStorage.removeItem("token");
//     localStorage.removeItem("shop");
//     setUser(null);
//     // Clear form data on logout
//     useShopStore.getState().setFormData({
//       email: "",
//       password: "",
//       city: "",
//       shopName: "",
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, authLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "../utils/axiosInstance";
import { useShopStore } from "../store/useShopStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { setFormData } = useShopStore();

  const checkAuth = useCallback(async () => {
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
      console.error("Auth check failed:", err);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("shop");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token, shopData) => {
    // localStorage is optional depending on your needs
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

    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("shop");

    setFormData({
      email: "",
      password: "",
      city: "",
      shopName: "",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
