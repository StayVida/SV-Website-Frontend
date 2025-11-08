import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building, Calendar, Info, Phone, LayoutDashboard } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthDialog from "@/components/auth/AuthDialog";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Hotels", href: "/hotels", icon: Building },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

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
            {isLoggedIn ? (
              <>
                {user?.role !== 'user' && (
                  <Button 
                    variant="default" 
                    size="lg"
                    className="text-primary bg-background border-primary border-1 hover:text-white"
                    onClick={() => {
                      console.log("Navigate to dashboard");
                      // Add navigation to dashboard here
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Avatar className="h-8 w-8">
                    <div className="h-full w-full bg-transparent rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Avatar>
                </button>
              </>
            ) : (
              <>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="text-primary bg-background border-primary border-1 hover:text-white"
                  onClick={() => setIsAuthDialogOpen(true)}
                >
                  Get Started
                </Button>
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => {
                    // Handle property registration - could be a separate page or dialog
                    console.log("Navigate to property registration");
                    // For now, we'll just log it. You can add navigation or another dialog here
                  }}
                >
                  Register Property
                </Button>
              </>
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
                {isLoggedIn ? (
                  <>
                    {user?.role !== 'user' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-1 border-primary text-primary"
                        onClick={() => {
                          console.log("Navigate to dashboard");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    )}
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg mx-auto"
                    >
                      <Avatar className="h-8 w-8">
                        <div className="h-full w-full bg-transparent rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user?.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </Avatar>
                    </button>
                  </>
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
                        console.log("Navigate to property registration");
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