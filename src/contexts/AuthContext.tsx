import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  email: string;
  role: string;
  userID: number;
}

interface AuthData {
  token: string;
  user: User;
}

interface AuthContextType {
  authData: AuthData | null;
  isAuthenticated: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      try {
        setAuthData(JSON.parse(storedAuth));
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("authData");
      }
    }
  }, []);

  const login = (data: AuthData) => {
    setAuthData(data);
    localStorage.setItem("authData", JSON.stringify(data));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        isAuthenticated: !!authData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

