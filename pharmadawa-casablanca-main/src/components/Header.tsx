import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Pill,
  Sun,
  Moon,
  User,
  LogOut,
  Languages,
} from "lucide-react";

import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LoginDialog from "./LoginDialog";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1], // easeIn
    },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 * i,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  }),
};

const userMenuVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1], // easeIn
    },
  },
};

// Navigation component with sticky behavior and mobile responsiveness
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation menu items
  const isAdmin = isAuthenticated && user?.role === "admin";

  // Add notification bell and theme toggle for authenticated users
  const navItems = (
    <div className="flex items-center gap-4"> 
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );

  const menuItems = [
    // Always show Home link
    { href: "/", label: "الرئيسية", isActive: location.pathname === "/" },
    
    // Show FAQ only for authenticated users or on home page
    ...(isAuthenticated || location.pathname === "/"
      ? [
          {
            href: "/faqs",
            label: "الأسئلة الشائعة",
            isActive: location.pathname === "/faqs",
          },
        ]
      : []),
    
    // Only show order link for authenticated non-admin users
    ...(isAuthenticated && !isAdmin
      ? [
          {
            href: "/order",
            label: "طلب دواء",
            isActive: location.pathname === "/order",
          },
        ]
      : []),
    
    // Show pharmacy partners only for authenticated users
    ...(isAuthenticated
      ? [
          {
            href: "/pharmacy-partners",
            label: "الصيدليات الشريكة",
            isActive: location.pathname === "/pharmacy-partners",
          },
        ]
      : []),
    
    
  ].filter(Boolean);

  // Toggle dark/light mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUserClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };


  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-sm border-b shadow-soft"
            : "bg-transparent"
        }`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand name */}
            <Link
              to="/"
              className="flex items-center space-x-2 space-x-reverse font-arabic-display font-bold text-xl transition-smooth hover:text-primary w-20 h-20"
            >
              <img src="logo-removebg-preview.png" alt="logo" />
              <span className="text-gradient">توصيل الأدوية</span>
            </Link>

            {/* Desktop navigation menu */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className={`font-arabic transition-smooth hover:text-primary relative ${
                      item.isActive
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                    {item.isActive && (
                      <motion.span
                        className="absolute bottom-[-4px] right-0 w-full h-0.5 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleUserClick}
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name || "حسابي"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>خروج</span>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/register">إنشاء حساب</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    تسجيل الدخول
                  </Button>
                </div>
              )}
              {!isAdmin && isAuthenticated && (
                <Button asChild className="font-arabic animate-pulse-glow">
                  <Link to="/order">اطلب دواءك الآن</Link>
                </Button>
              )}
            </div>

            {/* Theme toggle */}
            <div className="flex items-center space-x-2 space-x-reverse">
              {/* Theme Toggle */}
              {/* <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground hover:bg-accent/50"
              aria-label="تبديل السمة"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button> */}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 p-0"
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile navigation menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden absolute top-full right-0 left-0 bg-background border-b shadow-medium overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <nav className="flex flex-col p-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * index, duration: 0.2 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block font-arabic p-3 rounded-lg transition-smooth hover:bg-accent ${
                          item.isActive
                            ? "text-primary bg-accent font-semibold"
                            : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  {!isAdmin && isAuthenticated && (
                    <motion.div
                      className="pt-2 border-t mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * menuItems.length }}
                    >
                      <Button asChild className="w-full font-arabic">
                        <Link to="/order" onClick={() => setIsMenuOpen(false)}>
                          اطلب دواءك الآن
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                  {isAuthenticated && (
                    <motion.div
                      className="pt-2 border-t mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (menuItems.length + 1) }}
                    >
                      <Button
                        variant="outline"
                        className="w-full font-arabic text-red-600 hover:text-red-700 hover:border-red-300 flex items-center justify-center gap-2"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </Button>
                    </motion.div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
      {showLoginDialog && (
        <LoginDialog onClose={() => setShowLoginDialog(false)} />
      )}
    </>
  );
};

export default Header;
