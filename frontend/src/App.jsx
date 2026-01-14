import { AuthProvider, useAuth } from "./context/authcontext";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Dashboard from "./pages/dashboard";

import { useState } from "react";
import "./index.css";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) return <p className="center">Loading...</p>;

  if (!user) {
    return (
      <div className="center">
        {showLogin ? <Login /> : <Register />}
        <p onClick={() => setShowLogin(!showLogin)} className="switch">
          {showLogin ? "Create account" : "Back to login"}
        </p>
      </div>
    );
  }

  return <Dashboard />;

};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
