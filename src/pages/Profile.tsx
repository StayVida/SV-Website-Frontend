import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Mail, Shield, LogOut, CalendarCheck, Clock } from "lucide-react";
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
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  status?: string;
}

const AVATAR_API_URL = "https://avatar.iran.liara.run/public";
const BOOKINGS_ENDPOINT = "/bookings/history";

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

        const result = await response.json().catch(() => ({}));
        const rawBookings = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.bookings)
          ? result.bookings
          : [];

        const normalized: Booking[] = rawBookings.map((item: any, index: number) => ({
          id: String(item?.id ?? item?.bookingId ?? item?._id ?? `booking-${index}`),
          hotelName: item?.hotelName ?? item?.hotel?.name ?? "Unnamed stay",
          destination: item?.destination ?? item?.hotel?.destination ?? item?.city,
          checkIn: item?.checkIn ?? item?.checkInDate ?? item?.startDate,
          checkOut: item?.checkOut ?? item?.checkOutDate ?? item?.endDate,
          guests: item?.guests ?? item?.guestCount,
          status: item?.status ?? item?.bookingStatus,
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
        <CardDescription className="flex items-center text-gray-600">
          <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
          {booking.destination ?? "Destination not available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-700">
          <CalendarCheck className="mr-2 h-4 w-4 text-gray-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span>Check-in: {booking.checkIn ? booking.checkIn : "Not provided"}</span>
            <span className="hidden sm:inline-block text-gray-300">•</span>
            <span>Check-out: {booking.checkOut ? booking.checkOut : "Not provided"}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <span>{booking.guests ? `${booking.guests} guest${booking.guests > 1 ? "s" : ""}` : "Guests not specified"}</span>
          </div>
          <span className="font-medium text-gray-900 capitalize">
            {booking.status ? booking.status : "Completed"}
          </span>
        </div>
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
