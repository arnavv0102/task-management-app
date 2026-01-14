import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Consolidating state prevents "partial updates" that cause the flicker
  const [authState, setAuthState] = useState({
    user: null,
    token: localStorage.getItem("token"),
    loading: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      // If no token exists, we are done loading immediately
      if (!authState.token) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const data = await apiRequest("/auth/profile", "GET", null, authState.token);
        // Update both user and loading at the same time
        setAuthState((prev) => ({
          ...prev,
          user: data.user,
          loading: false,
        }));
      } catch (err) {
        console.error("Profile fetch failed:", err);
        // Clear storage and state if the token is invalid/expired
        localStorage.removeItem("token");
        setAuthState({ user: null, token: null, loading: false });
      }
    };

    fetchProfile();
    // We only run this on mount. If the token changes via login(), 
    // the login function handles the state update itself.
  }, []);

  const login = (jwt, userdata) => {
    localStorage.setItem("token", jwt);
    
    // Crucial: Update the entire object at once.
    // This prevents App.jsx from seeing the token change before the user data arrives.
    setAuthState({
      token: jwt,
      user: userdata,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      token: null,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        loading: authState.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);