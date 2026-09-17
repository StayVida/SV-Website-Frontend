import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/config/api";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/axios";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_OTP_LENGTH = 4;
const RESEND_INTERVAL = 60;

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const resendTimerRef = useRef<number | null>(null);

  const clearResendTimer = useCallback(() => {
    if (resendTimerRef.current) {
      window.clearInterval(resendTimerRef.current);
      resendTimerRef.current = null;
    }
    setResendTimer(0);
  }, []);

  const startResendTimer = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    clearResendTimer();
    setResendTimer(RESEND_INTERVAL);

    resendTimerRef.current = window.setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearResendTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearResendTimer]);

  const resetState = useCallback(() => {
    setEmail("");
    setOtp("");
    setIsOtpSent(false);
    setError(null);
    setStatusMessage(null);
    clearResendTimer();
  }, [clearResendTimer]);

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    return () => {
      clearResendTimer();
    };
  }, [clearResendTimer]);

  const requestOtpMutation = useMutation({
    mutationFn: async (emailAddress: string) => {
      const response = await apiClient.post(API_ENDPOINTS.GET_OTP, { email: emailAddress });
      return response.data;
    },
    onSuccess: (data) => {
      setIsOtpSent(true);
      setStatusMessage(data.message || "OTP sent to your email. Please check your inbox.");
      setOtp("");
      startResendTimer();
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Failed to send OTP. Please try again.");
    }
  });

  const requestOtp = useCallback((emailAddress: string) => {
    requestOtpMutation.mutate(emailAddress);
  }, [requestOtpMutation]);

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { emailAddress: string, otpCode: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, {
        email: data.emailAddress,
        otp: data.otpCode,
      });
      return response.data;
    },
    onSuccess: (responseData, variables) => {
      if (responseData.success && responseData.token) {
        login({
          token: responseData.token,
          user: {
            email: responseData.email ?? variables.emailAddress,
            role: responseData.role ?? "user",
            userID: responseData.userID ?? 0,
          },
        });

        resetState();
        onOpenChange(false);
      } else {
        setError(responseData.message || "Authentication failed");
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Invalid OTP. Please try again.");
    }
  });

  const verifyOtp = useCallback((emailAddress: string, otpCode: string) => {
    verifyOtpMutation.mutate({ emailAddress, otpCode });
  }, [verifyOtpMutation]);

  const isLoading = requestOtpMutation.isPending || verifyOtpMutation.isPending;

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    await requestOtp(email.trim());
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (otp.length !== MAX_OTP_LENGTH) {
      setError(`OTP must be ${MAX_OTP_LENGTH} digits`);
      return;
    }

    await verifyOtp(email.trim(), otp);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isLoading) {
      return;
    }

    await requestOtp(email.trim());
  };

  const handleOtpChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, MAX_OTP_LENGTH);
    setOtp(digitsOnly);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border-gray-200 shadow-xl">
        <DialogHeader className="bg-white border-b border-gray-100">
          <DialogTitle className="text-gray-900">Sign In</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your email to receive a one-time password (OTP). Use the 4-digit OTP to sign in securely.
          </DialogDescription>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>

        <div className="p-6 space-y-6">
          {statusMessage && (
            <div className="rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              {statusMessage}
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
                  placeholder="Enter your email"
                  required
                  disabled={isOtpSent || isLoading}
                />
              </div>
            </div>

            {isOtpSent && (
              <div className="space-y-2">
                <Label htmlFor="auth-otp" className="text-gray-700 font-medium">
                  4-digit OTP
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) => handleOtpChange(event.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 tracking-[0.4em] text-center text-lg"
                    placeholder="••••"
                    maxLength={MAX_OTP_LENGTH}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Didn't receive the OTP?</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed bg-transparent"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full py-2.5 text-white font-medium" disabled={isLoading}>
              {isLoading ? (isOtpSent ? "Verifying..." : "Sending OTP...") : isOtpSent ? "Verify OTP" : "Send OTP"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
