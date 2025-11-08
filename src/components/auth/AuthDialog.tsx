import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Mail, Lock, Eye, EyeOff, User, Phone, MessageSquare } from "lucide-react";
import { loginWithGoogle, saveUserData, requestOtp, verifyOtp } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";


interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const [gsiReady, setGsiReady] = useState(false);
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email');
  const [otpEmail, setOtpEmail] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [otpData, setOtpData] = useState({
    otp: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Load Google Identity Services script
  useEffect(() => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      setGsiReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiReady(true);
    script.onerror = () => setGsiReady(false);
    document.head.appendChild(script);
  }, []);

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      await requestOtp(loginData.email);
      setOtpEmail(loginData.email);
      setOtpStep('otp');
    } catch (error: any) {
      console.error('OTP request error:', error);
      setErrors({
        general: error.response?.data?.message || 'Failed to send OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await verifyOtp(otpEmail, otpData.otp);
      
      if (response.success) {
        // Save user data and token
        const userData = {
          username: response.username,
          email: response.email,
          role: response.role,
        };
        
        saveUserData(userData, response.token);
        login(userData);
        
        // Reset form
        setLoginData({ email: "", password: "" });
        setOtpData({ otp: "" });
        setOtpStep('email');
        setOtpEmail("");
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setErrors({
        general: error.response?.data?.message || 'Invalid OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setOtpStep('email');
    setOtpData({ otp: "" });
    setErrors({});
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Signup data:", signupData);
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleGoogleContinue = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
      if (!clientId) {
        throw new Error('Missing VITE_GOOGLE_CLIENT_ID');
      }
      const google = (window as any).google;
      if (!gsiReady || !google?.accounts?.id) {
        throw new Error('Google services not ready. Please try again.');
      }

      await new Promise<void>((resolve) => {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (credentialResponse: any) => {
            try {
              const idToken = credentialResponse?.credential as string;
              if (!idToken) throw new Error('No credential received from Google');

              const response = await loginWithGoogle(idToken);
              if (response.success) {
                const userData = {
                  username: response.username,
                  email: response.email,
                  role: response.role,
                };
                saveUserData(userData, response.token);
                login(userData);
                onOpenChange(false);
              }
            } catch (err) {
              console.error('Google login error:', err);
              setErrors({ general: (err as any)?.message || 'Google sign-in failed. Please try again.' });
            } finally {
              resolve();
            }
          },
        });
        google.accounts.id.prompt();
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrors({
        general: error.response?.data?.message || 'Google sign-in failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setErrors({});
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setErrors({});
    setOtpStep('email');
    setOtpEmail("");
    setOtpData({ otp: "" });
  };

  // Reset OTP step when dialog closes
  useEffect(() => {
    if (!open) {
      setOtpStep('email');
      setOtpEmail("");
      setOtpData({ otp: "" });
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border-gray-200 shadow-xl">
        <DialogHeader className="bg-white border-b border-gray-100">
          <DialogTitle className="text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isLogin 
              ? "Sign in to your account to continue" 
              : "Sign up to get started with StayVida"
            }
          </DialogDescription>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6 bg-white">
          <button
            type="button"
            onClick={switchToLogin}
            className={`flex-1 py-3 px-1 text-center text-sm font-medium border-b-2 transition-colors bg-white ${
              isLogin
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={switchToSignup}
            className={`flex-1 py-3 px-1 text-center text-sm font-medium border-b-2 transition-colors bg-white ${
              !isLogin
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6 bg-white">
          {isLogin ? (
            // Login Form - OTP Flow
            otpStep === 'email' ? (
              <form onSubmit={handleOtpRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {errors.general && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {errors.general}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white font-medium py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp-email"
                      type="email"
                      value={otpEmail}
                      disabled
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-green-600 hover:text-green-700 font-medium bg-transparent"
                  >
                    Change email
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-otp" className="text-gray-700 font-medium">OTP</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-otp"
                      name="otp"
                      type="text"
                      value={otpData.otp}
                      onChange={(e) => setOtpData({ otp: e.target.value })}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter OTP"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    We've sent a 6-digit OTP to {otpEmail}
                  </p>
                </div>

                {errors.general && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {errors.general}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white font-medium py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            )
          ) : (
            // Signup Form
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstName" className="text-gray-700 font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-firstName"
                      name="firstName"
                      type="text"
                      value={signupData.firstName}
                      onChange={handleSignupInputChange}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastName" className="text-gray-700 font-medium">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-lastName"
                      name="lastName"
                      type="text"
                      value={signupData.lastName}
                      onChange={handleSignupInputChange}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={signupData.email}
                    onChange={handleSignupInputChange}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-gray-700 font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    value={signupData.phone}
                    onChange={handleSignupInputChange}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={signupData.password}
                    onChange={handleSignupInputChange}
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 bg-transparent text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={signupData.confirmPassword}
                    onChange={handleSignupInputChange}
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 bg-transparent text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  aria-label="Agree to terms and privacy policy"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-green-600 bg-transparent hover:text-green-700 underline font-medium"
                    onClick={() => console.log("Terms clicked")}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-green-600 bg-transparent hover:text-green-700 underline font-medium"
                    onClick={() => console.log("Privacy clicked")}
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full  text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          {/* Social Login/Signup */}
          <div className="mt-6 bg-white">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                onClick={handleGoogleContinue}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? 'Connecting…' : 'Continue with Google'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
