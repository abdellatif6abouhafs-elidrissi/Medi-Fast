import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
};

type FeatureFlags = {
  enableGPT5Mini: boolean;
  // Add more feature flags here as needed
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: "user" | "admin";
    address?: string;
    city?: string;
    postalCode?: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (updatedUser: User) => void;
  features: FeatureFlags;
  updateFeatures: (features: Partial<FeatureFlags>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [features, setFeatures] = useState<FeatureFlags>({
    enableGPT5Mini: false,
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const mapBackendUser = (u: any): User => ({
    id: u.id || u._id || "",
    name: u.name,
    email: u.email,
    role: (u.role as "admin" | "user") || "user",
    phone: u.phone,
    address: u.address,
    city: u.city,
    postalCode: u.postalCode,
  });

  const updateFeatures = (newFeatures: Partial<FeatureFlags>) => {
    if (user?.role !== "admin") {
      console.error("Only admin users can update features");
      return;
    }
    setFeatures((prev) => ({ ...prev, ...newFeatures }));
    // Persist feature flags in localStorage
    localStorage.setItem(
      "features",
      JSON.stringify({ ...features, ...newFeatures })
    );
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const mapped = mapBackendUser(data.user);
      // Persist
      localStorage.setItem("user", JSON.stringify(mapped));
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      setUser(mapped);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const token = localStorage.getItem("token");
      if (token && updatedUser.id) {
        const res = await fetch(`${API_BASE}/api/users/${updatedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = mapBackendUser(data.user);
          setUser(mapped);
          localStorage.setItem("user", JSON.stringify(mapped));
          return;
        }
      }
    } catch (e) {
      console.error("Failed to update user via API, falling back to local", e);
    }
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: "user" | "admin";
    address?: string;
    city?: string;
    postalCode?: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const mapped = mapBackendUser(data.user);
      localStorage.setItem("user", JSON.stringify(mapped));
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      setUser(mapped);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state and features from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedFeatures = localStorage.getItem("features");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    if (storedFeatures) {
      setFeatures(JSON.parse(storedFeatures));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
        updateUser,
        features,
        updateFeatures,
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

export default AuthContext;
