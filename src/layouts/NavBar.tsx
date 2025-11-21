import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building, Calendar, Info, Phone, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NavBar = () => {
  const { isAuthenticated, authData, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">StayVida</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-md font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-gray-600 hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {
              !isAuthenticated && (<Button 
                variant="default" 
                size="lg" 
                className="text-primary bg-background border-primary border-1 hover:text-white"
                onClick={() => setIsAuthDialogOpen(true)}
              >
                Get Started
              </Button>
              )
            }
            
            <Button 
              variant="default" 
              size="lg"
              onClick={handleRegisterProperty}
            >
              Register Property
            </Button>
            {isAuthenticated && (
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
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="default"
              size="sm"
              className="bg-primary border-1 border-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
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
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Dialog */}
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
      />
    </header>
  );
};

export default NavBar;