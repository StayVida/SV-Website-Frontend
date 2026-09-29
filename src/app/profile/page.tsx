"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import usePageSEO from "@/hooks/usePageSEO";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RecommendedHotels, type RecommendedHotel } from "@/components/profile/RecommendedHotels";
import { PreviousBookings, type Booking } from "@/components/profile/PreviousBookings";
import { getUserWallet } from "@/api/booking";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/axios";

const AVATAR_API_URL = "https://api.dicebear.com/9.x/toon-head/svg?seed=Sophie";
const BOOKINGS_ENDPOINT = "/api/profile/history";

const ProfilePage = () => {
  usePageSEO({
    title: "My Profile",
    description: "Manage your StayVida account, view booking history, and discover personalised hotel recommendations.",
  });
  const { authData, login, logout } = useAuth();
  const router = useRouter();

  const { data: avatarUrl = null, isLoading: isLoadingAvatar, error: avatarErrorObject } = useQuery({
    queryKey: ['avatar', authData?.user?.email],
    queryFn: async () => {
      if (!authData?.user?.email) return null;
      const avatarResponse = await fetch(`${AVATAR_API_URL}?username=${encodeURIComponent(authData.user.email)}`);
      if (!avatarResponse.ok) throw new Error("Unable to load avatar");
      const blob = await avatarResponse.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!authData?.user?.email,
    staleTime: Infinity,
  });
  const avatarError = avatarErrorObject?.message || null;

  const { data: recommendedHotels = [], isLoading: isLoadingRecommended, error: recommendedErrorObject } = useQuery({
    queryKey: ['recommendedHotels'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.FEATURED_HOTELS);
      const result = response.data;
      const data = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

      return data.map((item: any, index: number) => ({
        id: String(item?.id ?? item?.hotelId ?? item?._id ?? `hotel-${index}`),
        name: item?.name ?? "Unnamed Property",
        destination: item?.destination ?? item?.city ?? "Unknown destination",
        rating: typeof item?.rating === "number" ? item.rating : 0,
        price:
          typeof item?.["base price"] === "number"
            ? item["base price"]
            : typeof item?.price === "number"
            ? item.price
            : Array.isArray(item?.rooms) && typeof item?.rooms[0]?.price === "number"
              ? item.rooms[0].price
              : undefined,
        imageUrl: item?.image ?? item?.imageUrl ?? item?.images?.[0] ?? null,
      }));
    }
  });
  const recommendedError = recommendedErrorObject?.message || null;

  const { data: bookings = [], isLoading: isLoadingBookings, error: bookingsErrorObject } = useQuery({
    queryKey: ['bookingHistory', authData?.token],
    queryFn: async () => {
      if (!authData?.token) return [];
      try {
        const response = await apiClient.get(BOOKINGS_ENDPOINT);
        const result = response.data;
        const rawBookings = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];

        return rawBookings.map((item: any, index: number) => ({
          id: String(item?.booking_ID ?? item?.id ?? `booking-${index}`),
          hotelName: item?.name ?? item?.hotelName ?? "Unnamed stay",
          roomNumber: item?.RoomNumber ?? undefined,
          checkIn: item?.checkIn,
          checkOut: item?.checkOut,
          bookingStatus: item?.booking_Status ?? item?.bookingStatus,
          paymentStatus: item?.payment_Status ?? item?.paymentStatus,
          paymentLeft: item?.["payment left"] ?? item?.paymentLeft,
          grossAmount: item?.["gross amount"] ?? item?.grossAmount,
        }));
      } catch (error: any) {
        if (error.response?.status === 404) return [];
        throw new Error(error.response?.data?.message || "Failed to fetch booking history");
      }
    },
    enabled: !!authData?.token,
  });
  const bookingsError = bookingsErrorObject?.message || null;

  const { data: walletBalance = null, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['userWallet', authData?.token],
    queryFn: async () => {
      if (!authData?.token) return null;
      const res = await getUserWallet();
      return res?.data?.balance ?? null;
    },
    enabled: !!authData?.token
  });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleProfileUpdate = (newName: string, newPhoneNumber: string) => {
    if (authData) {
      const updatedAuthData = {
        ...authData,
        user: {
          ...authData.user,
          name: newName,
          phoneNumber: newPhoneNumber,
        },
      };
      login(updatedAuthData);
    }
  };

  if (!authData) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">You need to be signed in</h1>
          <p className="text-gray-600 max-w-md">
            Sign in to view your profile, personalised recommendations, and booking history.
          </p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </section>
    );
  }

  const { user } = authData;
  const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User";

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <ProfileHeader
          user={user}
          avatarUrl={avatarUrl}
          isLoadingAvatar={isLoadingAvatar}
          formattedRole={formattedRole}
          onLogout={handleLogout}
          onProfileUpdate={handleProfileUpdate}
          walletBalance={walletBalance}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
          <div className="lg:col-span-4 space-y-6">
            <RecommendedHotels
              hotels={recommendedHotels}
              isLoading={isLoadingRecommended}
              error={recommendedError}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <PreviousBookings
              bookings={bookings}
              isLoading={isLoadingBookings}
              error={bookingsError}
              onViewBookingDetails={(bookingId) => router.push(`/booking/${bookingId}`)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
