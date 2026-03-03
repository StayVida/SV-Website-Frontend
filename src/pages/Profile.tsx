import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Mail, Shield, LogOut, CalendarCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";

interface RecommendedHotel {
  id: string;
  name: string;
  destination: string;
  rating: number;
  price?: number;
  imageUrl?: string | null;
}

interface Booking {
  id: string;
  hotelName: string;
  roomNumber?: number;
  checkIn?: string;
  checkOut?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  paymentLeft?: number;
  grossAmount?: number;
}

const AVATAR_API_URL = "https://avatar.iran.liara.run/public";
const BOOKINGS_ENDPOINT = "/api/profile/history";

const ProfilePage = () => {
  const { authData, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate("/");
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
            typeof item?.price === "number"
              ? item.price
              : Array.isArray(item?.rooms) && typeof item?.rooms[0]?.price === "number"
                ? item.rooms[0].price
                : undefined,
          imageUrl: item?.imageUrl ?? item?.images?.[0] ?? null,
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

  const renderHotelCard = (hotel: RecommendedHotel) => (
    <Card key={hotel.id} className="h-full overflow-hidden border border-gray-200 shadow-sm">
      <div className="relative h-44 w-full bg-gray-100">
        <img
          src={hotel.imageUrl ?? "/placeholder.svg?height=240&width=320"}
          alt={hotel.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            (event.target as HTMLImageElement).src = "/placeholder.svg?height=240&width=320";
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">{hotel.name}</CardTitle>
        <CardDescription className="flex items-center text-gray-600">
          <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
          {hotel.destination}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{hotel.rating > 0 ? hotel.rating.toFixed(1) : "New"}</span>
          </div>
          {typeof hotel.price === "number" && (
            <span className="text-sm font-semibold text-gray-900">₹{Math.round(hotel.price)}/night</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">{booking.hotelName}</CardTitle>
        <CardDescription className="text-xs text-gray-400 font-mono">{booking.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {typeof booking.roomNumber === "number" && (
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <span>Room {booking.roomNumber}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-700">
          <CalendarCheck className="mr-2 h-4 w-4 text-gray-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span>Check-in: {booking.checkIn ?? "Not provided"}</span>
            <span className="hidden sm:inline-block text-gray-300">•</span>
            <span>Check-out: {booking.checkOut ?? "Not provided"}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={`capitalize font-medium px-2 py-0.5 rounded-full text-xs ${booking.bookingStatus?.toLowerCase() === "checkedout"
            ? "bg-green-100 text-green-700"
            : booking.bookingStatus?.toLowerCase() === "confirmed"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
            }`}>
            {booking.bookingStatus ?? "—"}
          </span>
          <span className={`capitalize font-medium text-xs ${booking.paymentStatus?.toLowerCase() === "pending"
            ? "text-yellow-600"
            : "text-gray-700"
            }`}>
            Payment: {booking.paymentStatus ?? "—"}
          </span>
        </div>
        {(typeof booking.grossAmount === "number" || typeof booking.paymentLeft === "number") && (
          <div className="flex items-center justify-between text-sm text-gray-700 border-t border-gray-100 pt-2 mt-1">
            {typeof booking.grossAmount === "number" && (
              <span>Total: <span className="font-semibold text-gray-900">₹{booking.grossAmount.toLocaleString()}</span></span>
            )}
            {typeof booking.paymentLeft === "number" && (
              <span>Due: <span className="font-semibold text-red-600">₹{booking.paymentLeft.toLocaleString()}</span></span>
            )}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-1"
          onClick={() => navigate(`/booking/${booking.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.email} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                    {isLoadingAvatar ? (
                      <span className="text-sm font-medium">Loading…</span>
                    ) : (
                      <span className="text-2xl font-semibold">{user.email.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{user.email}</h1>
                <p className="mt-1 text-sm text-gray-600">User ID: {user.userID}</p>
                <p className="mt-1 text-sm text-gray-600">{formattedRole}</p>
                {avatarError && <p className="mt-2 text-sm text-red-600">{avatarError}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span>{formattedRole}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" className="mt-2 flex items-center gap-2 text-red-600">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Recommended hotels for you</CardTitle>
                <CardDescription>Discover stays curated specially for your travel style.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {isLoadingRecommended ? (
                  <div className="py-6 text-center text-gray-600">Loading recommendations…</div>
                ) : recommendedError ? (
                  <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {recommendedError}
                  </div>
                ) : recommendedHotels.length === 0 ? (
                  <div className="py-6 text-center text-gray-600">No recommendations available right now.</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recommendedHotels.slice(0, 4).map((hotel) => renderHotelCard(hotel))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Previous bookings</CardTitle>
                <CardDescription>Your most recent stay history and trip details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {isLoadingBookings ? (
                  <div className="py-4 text-center text-gray-600">Loading your booking history…</div>
                ) : bookingsError ? (
                  <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {bookingsError}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-4 text-center text-gray-600">Previous history is not available.</div>
                ) : (
                  bookings.slice(0, 3).map((booking) => renderBookingCard(booking))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
