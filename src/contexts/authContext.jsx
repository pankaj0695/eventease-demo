import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(userData) {
    if (userData) {
      setUser({ ...userData });
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
