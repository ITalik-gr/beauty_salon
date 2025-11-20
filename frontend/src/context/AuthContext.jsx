import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // дані юзера (id, email, role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('provider use effect');
    
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me").then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    setUser(user);

    return user;
  };

  const register = async (data) => {
    console.log(data);
    const res = await api.post("/auth/register", data);
    
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}