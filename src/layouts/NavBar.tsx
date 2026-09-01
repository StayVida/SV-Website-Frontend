import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building, Calendar, Info, Phone, User } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DASHBOARD_URL } from "@/config/api";

const NavBar = () => {
  const { isAuthenticated, authData, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const isWhiteTextNeeded = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");
    const storedHotelId = localStorage.getItem("hotelId");
    setOwnerId(storedOwnerId || storedHotelId);
  }, [isAuthenticated]);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Hotels", href: "/hotels", icon: Building },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const handleRegisterProperty = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    navigate("/register-property");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white shadow-md border-b border-gray-200 py-1"
          : "bg-white/10 backdrop-blur-md border-b border-white/20 py-2"
        }`}
    >
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className={`flex items-center transition-all duration-500 transform ${
              scrolled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            }`}
          >
            <NavLink to="/" className="flex-shrink-0">
              <img
                src="/logo.webp"
                alt="StayVida"
                className="h-12 md:h-15 w-auto object-contain"
              />
            </NavLink>
          </div>

          {/* Mobile Right Side: Profile & Menu */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-green-600 hover:ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                aria-label="Profile"
              >
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="bg-green-600 text-white text-xs font-medium">
                    {authData?.user.email ? authData.user.email.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthDialogOpen(true)}
                className={`flex items-center justify-center p-1.5 bg-transparent rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-gray-600 ${
                  scrolled ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
                aria-label="Login"
              >
                <User className="w-6 h-6" />
              </button>
            )}
            <Button
              variant="default"
              size="sm"
              className="bg-primary border-1 border-primary px-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Desktop Left Side: Navigation & CTA */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-md font-medium transition-colors ${isActive
                      ? "text-primary font-semibold"
                      : isWhiteTextNeeded
                        ? "text-white hover:text-primary"
                        : "text-gray-600 hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {authData?.user?.role === "hotel_owner" || ownerId ? (
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => window.location.href = DASHBOARD_URL}
                >
                  My Dashboard
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleRegisterProperty}
                >
                  Register Property
                </Button>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-green-600 hover:ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  aria-label="Profile"
                >
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarFallback className="bg-green-600 text-white text-sm font-medium">
                      {authData?.user.email ? authData.user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  className={`${scrolled ? "text-primary bg-background border-primary border-1 hover:text-white" : "bg-white text-primary hover:bg-gray-100"}`}
                  onClick={() => setIsAuthDialogOpen(true)}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 rounded-b-xl shadow-lg mt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-gray-600 hover:text-primary"
                    }`
                  }
                  end={item.href === "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 inline mr-2" />
                  {item.name}
                </NavLink>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{authData?.user.email}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{authData?.user.role}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-start gap-2"
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-1 border-primary text-primary"
                    onClick={() => {
                      setIsAuthDialogOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                )}

                {authData?.user?.role === "hotel_owner" || ownerId ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      window.location.href = DASHBOARD_URL;
                    }}
                  >
                    My Dashboard
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      handleRegisterProperty();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Register Property
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
    </header>
  );
};

export default NavBar;