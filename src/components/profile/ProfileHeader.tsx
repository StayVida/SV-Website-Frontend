import { useState } from "react";
import { Mail, Shield, LogOut, User as UserIcon, Phone, Loader2, Edit2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import type { User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateProfile } from "@/api/auth";
import { toast } from "sonner";

interface ProfileHeaderProps {
  user: User;
  avatarUrl: string | null;
  isLoadingAvatar: boolean;
  formattedRole: string;
  onLogout: () => void;
  onProfileUpdate: (newName: string, newPhoneNumber: string) => void;
}

const profileSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces." })
    .trim(),
  phoneNumber: z.string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." })
    .trim(),
});

export const ProfileHeader = ({
  user,
  avatarUrl,
  isLoadingAvatar,
  formattedRole,
  onLogout,
  onProfileUpdate,
}: ProfileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>({});

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = profileSchema.safeParse({
      name,
      phoneNumber,
    });

    if (!validation.success) {
      const fieldErrors: { name?: string; phoneNumber?: string } = {};
      validation.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0] === "name") fieldErrors.name = err.message;
        if (err.path[0] === "phoneNumber") fieldErrors.phoneNumber = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile({
        name: validation.data.name,
        phoneNumber: validation.data.phoneNumber,
      });
      
      toast.success("Profile updated successfully!");
      onProfileUpdate(validation.data.name, validation.data.phoneNumber);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isProfileComplete = !!(user.name && user.phoneNumber);

  return (
    <Card className="border border-gray-200 shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-teal-600" />
      <CardContent className="flex flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between relative">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-gray-100 to-gray-50 group">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.email} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                {isLoadingAvatar ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {user.name || "Vida Guest"}
              </h1>
              {isProfileComplete && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-green-200 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">User ID: <span className="font-mono text-gray-700">{user.userID}</span></p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-3.5 h-3.5" />
              {formattedRole}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
          <div className="flex flex-col gap-2 text-sm text-gray-600 bg-gray-50/80 p-4 rounded-xl border border-gray-100 min-w-[220px]">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate max-w-[180px] font-medium" title={user.email}>{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium">{user.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant={isProfileComplete ? "outline" : "default"}
                  className={`flex-1 flex items-center justify-center gap-2 shadow-sm font-semibold h-11 ${
                    !isProfileComplete ? "bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95 text-white" : ""
                  }`}
                >
                  <Edit2 className="h-4 w-4" />
                  {isProfileComplete ? "Edit Profile" : "Complete Profile"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[420px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    {isProfileComplete ? "Edit Profile Details" : "Complete Your Profile"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-sm text-gray-700 font-semibold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder="Enter your full name"
                        className={`pl-11 h-12 ${errors.name ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
                        required
                        disabled={isUpdating}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone" className="text-sm text-gray-700 font-semibold">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <Input
                        id="profile-phone"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (errors.phoneNumber) {
                            setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                          }
                        }}
                        placeholder="e.g. 9876543210"
                        type="tel"
                        className={`pl-11 h-12 ${errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
                        required
                        disabled={isUpdating}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full mt-4 h-12 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95 text-white font-bold text-base shadow-md"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving Profile...
                      </span>
                    ) : (
                      "Save Details"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold h-11 px-3">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
