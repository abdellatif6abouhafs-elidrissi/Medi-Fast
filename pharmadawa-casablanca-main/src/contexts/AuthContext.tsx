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
  // Pharmacy reference for admin users (ObjectId from backend)
  pharmacy?: string;
  // Pharmacy information for admin users (cached/fallback data)
  pharmacyId?: string;
  pharmacyName?: string;
  pharmacySpecialties?: string[];
  pharmacyWorkingHours?: string;
  pharmacyImage?: string;
  pharmacyAddress?: string;
  pharmacyPhone?: string;
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
    // Admin/Pharmacy specific fields
    pharmacyName?: string;
    pharmacySpecialties?: string[];
    pharmacyWorkingHours?: string;
    pharmacyImage?: string;
  }) => Promise<{ success: boolean; error?: string }>;
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
    // Pharmacy reference (ObjectId from backend)
    pharmacy: u.pharmacy,
    // Pharmacy information for admin users (cached/fallback data)
    pharmacyId: u.pharmacyId,
    pharmacyName: u.pharmacyName,
    pharmacySpecialties: u.pharmacySpecialties,
    pharmacyWorkingHours: u.pharmacyWorkingHours,
    pharmacyImage: u.pharmacyImage,
    pharmacyAddress: u.pharmacyAddress,
    pharmacyPhone: u.pharmacyPhone,
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
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: User) => {
    // Update locally ONLY - no API calls to avoid hanging
    console.log("Updating user locally:", updatedUser);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const register = async (userData: {
    password: string;
    name: string;
    phone: string;
    role?: "user" | "admin";
    address?: string;
    city?: string;
    postalCode?: string;
    // Admin/Pharmacy specific fields
    pharmacyName?: string;
    pharmacySpecialties?: string[];
    pharmacyWorkingHours?: string;
    pharmacyImage?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          return { success: false, error: "Email already exists" };
        }
        return { success: false, error: data.message || "Registration failed" };
      }

      const mapped = mapBackendUser(data.user);
      localStorage.setItem("user", JSON.stringify(mapped));
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      setUser(mapped);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An unexpected error occurred" };
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
