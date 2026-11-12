import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("eventHubToken");
    const savedUser = localStorage.getItem("eventHubUser");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("eventHubToken");
        localStorage.removeItem("eventHubUser");
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await loginUser(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("eventHubToken", data.token);
    localStorage.setItem("eventHubUser", JSON.stringify(data.user));
    return data;
  }

  async function register(name, email, password, role = "user") {
    const data = await registerUser(name, email, password, role);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("eventHubToken", data.token);
    localStorage.setItem("eventHubUser", JSON.stringify(data.user));
    return data;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("eventHubToken");
    localStorage.removeItem("eventHubUser");
  }

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;