import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import usePageSEO from "@/hooks/usePageSEO";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RecommendedHotels, type RecommendedHotel } from "@/components/profile/RecommendedHotels";
import { PreviousBookings, type Booking } from "@/components/profile/PreviousBookings";
import { getUserWallet } from "@/api/booking";

const AVATAR_API_URL = "https://api.dicebear.com/9.x/toon-head/svg?seed=Sophie";
const BOOKINGS_ENDPOINT = "/api/profile/history";

const ProfilePage = () => {
  usePageSEO({
    title: "My Profile",
    description: "Manage your StayVida account, view booking history, and discover personalised hotel recommendations.",
  });
  const { authData, login, logout } = useAuth();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [recommendedHotels, setRecommendedHotels] = useState<RecommendedHotel[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
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

  const resetAvatarUrl = useCallback(() => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarUrl(null);
  }, []);

  const fetchAvatar = useCallback(async () => {
    if (!authData?.user?.email) {
      resetAvatarUrl();
      return;
    }

    setIsLoadingAvatar(true);
    setAvatarError(null);

    try {
      const avatarResponse = await fetch(`${AVATAR_API_URL}?username=${encodeURIComponent(authData.user.email)}`);

      if (!avatarResponse.ok) {
        throw new Error("Unable to load avatar");
      }

      const blob = await avatarResponse.blob();
      const objectUrl = URL.createObjectURL(blob);

      resetAvatarUrl();
      avatarObjectUrlRef.current = objectUrl;
      setAvatarUrl(objectUrl);
    } catch (error: any) {
      resetAvatarUrl();
      setAvatarError(error?.message || "Unable to load avatar.");
    } finally {
      setIsLoadingAvatar(false);
    }
  }, [authData?.user?.email, resetAvatarUrl]);

  useEffect(() => {
    fetchAvatar();
    return () => resetAvatarUrl();
  }, [fetchAvatar, resetAvatarUrl]);

  useEffect(() => {
    const fetchRecommendedHotels = async () => {
      setIsLoadingRecommended(true);
      setRecommendedError(null);

      try {
        const response = await fetch(`${API_BASE_URI}${API_ENDPOINTS.FEATURED_HOTELS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommended hotels");
        }

        const result = await response.json();
        const data = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

        const normalized: RecommendedHotel[] = data.map((item: any, index: number) => ({
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

        setRecommendedHotels(normalized);
      } catch (error: any) {
        setRecommendedError(error?.message || "Unable to load recommended hotels.");
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendedHotels();
  }, []);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!authData?.token) {
        setBookings([]);
        return;
      }

      setIsLoadingBookings(true);
      setBookingsError(null);

      try {
        const response = await fetch(`${API_BASE_URI}${BOOKINGS_ENDPOINT}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
            Authorization: `Bearer ${authData.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setBookings([]);
            return;
          }
          throw new Error("Failed to fetch booking history");
        }

        const result = await response.json().catch(() => []);
        const rawBookings = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];

        const normalized: Booking[] = rawBookings.map((item: any, index: number) => ({
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

        setBookings(normalized);
      } catch (error: any) {
        setBookingsError(error?.message || "Unable to load booking history.");
        setBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookingHistory();
  }, [authData?.token]);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!authData?.token) return;
      setIsLoadingWallet(true);
      try {
        const res = await getUserWallet();
        if (res?.data?.balance !== undefined) {
          setWalletBalance(res.data.balance);
        }
      } catch (e) {
        console.error("Failed to fetch wallet", e);
      } finally {
        setIsLoadingWallet(false);
      }
    };
    fetchWallet();
  }, [authData?.token]);

  if (!authData) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">You need to be signed in</h1>
          <p className="text-gray-600 max-w-md">
            Sign in to view your profile, personalised recommendations, and booking history.
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
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
              onViewBookingDetails={(bookingId) => navigate(`/booking/${bookingId}`)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
