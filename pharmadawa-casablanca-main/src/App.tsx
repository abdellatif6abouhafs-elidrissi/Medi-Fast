import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Order from "./pages/Order";
import PharmacyPartners from "./pages/PharmacyPartners";
import FAQs from "./pages/FAQs";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import ProductManagement from "./pages/admin/ProductManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import OrderDetails from "./pages/admin/OrderDetails";
import Reports from "./pages/admin/Reports";
import Categories from "./pages/admin/Categories";
import Settings from "./pages/admin/Settings";
import PharmacyEdit from "./pages/admin/PharmacyEdit";
import MedicineManagement from "./pages/admin/MedicineManagement";
import TestComponent from "./pages/admin/TestComponent";
import OrderCompletion from "./pages/OrderCompletion";
import PharmacyMedicines from "./pages/PharmacyMedicines";
import Cart from "./components/Cart";
import PaymentPage from "./pages/payment/PaymentPage";
import OrderConfirmation from "./pages/order-confirmation/OrderConfirmation";
import { useEffect } from "react";
import AOS from "aos";

// Protected Route Component with role check
const RequireAuth = ({
  children,
  roles = ["user"],
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (user?.role && !roles.includes(user.role)) {
    // Redirect to appropriate page based on user role
    // If user is admin but route requires 'user', send to admin dashboard
    // If user is normal 'user' but route requires 'admin', send to Home
    const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Component to restrict unauthenticated users to home page only
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Dashboard component that renders the appropriate dashboard based on user role
const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

const queryClient = new QueryClient();

// Component to handle AOS initialization and refresh
const AOSInitializer = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <LanguageProvider>
              <CartProvider>
                <TooltipProvider>
                  <BrowserRouter>
                    <AOSInitializer />
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <Cart />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route 
                            path="/order" 
                            element={
                              <RequireAuth roles={["user"]}>
                                <Order />
                              </RequireAuth>
                            } 
                          />
                          <Route
                            path="/pharmacy-partners"
                            element={
                              <PublicRoute>
                                <PharmacyPartners />
                              </PublicRoute>
                            }
                          />
                          <Route
                            path="/pharmacy/:id/medicines"
                            element={
                              <RequireAuth roles={["user"]}>
                                <PharmacyMedicines />
                              </RequireAuth>
                            }
                          />
                          <Route 
                            path="/faqs" 
                            element={
                              <PublicRoute>
                                <FAQs />
                              </PublicRoute>
                            } 
                          />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route
                            path="/settings"
                            element={
                              <RequireAuth>
                                <AccountSettings />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/order-completion"
                            element={
                              <RequireAuth roles={["user"]}>
                                <OrderCompletion />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/payment"
                            element={
                              <RequireAuth roles={["user"]}>
                                <PaymentPage />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/order-confirmation"
                            element={
                              <RequireAuth roles={["user"]}>
                                <OrderConfirmation />
                              </RequireAuth>
                            }
                          />

                          {/* User Dashboard */}
                          <Route
                            path="/dashboard"
                            element={
                              <RequireAuth>
                                <Dashboard />
                              </RequireAuth>
                            }
                          />

                          {/* Admin Dashboard */}
                          <Route
                            path="/admin/dashboard"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <AdminDashboard />
                              </RequireAuth>
                            }
                          />

                          {/* Redirect old admin route */}
                          <Route
                            path="/admin"
                            element={<Navigate to="/admin/dashboard" replace />}
                          />

                          {/* Admin-specific routes */}
                          <Route
                            path="/admin/orders/:id"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <OrderDetails />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/products"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <ProductManagement />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/users"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <CustomerManagement />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/orders"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <OrderManagement />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/reports"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <Reports />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/categories"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <Categories />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/settings"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <Settings />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/pharmacy/edit"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <PharmacyEdit />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/admin/medicines"
                            element={
                              <RequireAuth roles={["admin"]}>
                                <MedicineManagement />
                              </RequireAuth>
                            }
                          />

                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </BrowserRouter>
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
