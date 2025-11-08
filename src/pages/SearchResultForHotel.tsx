import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SearchSummary from "@/components/searchResult/SearchSummary"
import FilterSidebar from "@/components/searchResult/FilterSidebar"
import Results from "@/components/searchResult/Results"
import ResultsSkeleton from "@/skeleton/ResultsSkeleton"
import apiClient from "@/api/axios"
import BaseUrl from "@/config/BaseUri"

interface SearchData {
  destination: string
  checkIn: string
  checkOut: string
  adults: string
  children: string
}

interface ApiHotelItem {
  id: number
  name: string
  type: string
  destination: string
  rating: number
  amenities: string[] | { name: string }[]
  imageUrl?: string
  images?: string[]
  isForEvent?: boolean
  price?: number
  pricePerNight?: number
}

interface ApiResponse<T> {
  data: T
}

interface UiAmenity {
  name: string
  icon: string
}

interface UiHotelItem {
  id: number
  name: string
  type: string
  destination: string
  rating: number
  amenities: UiAmenity[]
  images: string[]
  pricePerNight: number
}

function SearchResult() {
  const params = useParams()
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
  })

  // Filter state (example, can be expanded)
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [hotelTypes, setHotelTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [hotels, setHotels] = useState<UiHotelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get search parameters from route params
    setSearchData({
      destination: params.destination || "",
      checkIn: params.checkIn || "",
      checkOut: params.checkOut || "",
      adults: params.adults || "2",
      children: params.children || "0",
    })
  }, [params])

  // Fetch hotels when searchData changes and is populated
  useEffect(() => {
    if (!searchData.destination || !searchData.checkIn || !searchData.checkOut) return;

    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const body = {
          location: searchData.destination,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          adults: Number(searchData.adults || 0),
          children: Number(searchData.children || 0),
        };

        const response = await apiClient.post<ApiResponse<ApiHotelItem[]>>(`${BaseUrl}/api/hotels/search`, body);
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        console.log("payload",body)
        console.log("hotel data",response)
        const mapped: UiHotelItem[] = data.map((item) => {
          const amenityArray: UiAmenity[] = (item.amenities || []).map((a: any) =>
            typeof a === "string" ? { name: a, icon: "" } : { name: a?.name, icon: "" }
          );
          const images: string[] = item.images && item.images.length
            ? item.images
            : item.imageUrl
              ? [item.imageUrl]
              : [];
          const pricePerNight = (item.pricePerNight ?? item.price ?? 0) as number;
          return {
            id: item.id,
            name: item.name,
            type: item.type,
            destination: item.destination,
            rating: item.rating,
            amenities: amenityArray,
            images,
            pricePerNight,
          };
        });

        setHotels(mapped);
      } catch (e: any) {
        setHotels([]);
        setError(e?.message || "Failed to load hotels.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchData.destination, searchData.checkIn, searchData.checkOut, searchData.adults, searchData.children]);

  // Filtering logic (by sidebar filters)
  const filteredHotels = hotels.filter(hotel => {
    // Price filter (one directional: 0 to maxPrice)
    const price = hotel.pricePerNight || 0;
    if (price > maxPrice) return false;
    // Hotel type filter
    if (hotelTypes.length > 0 && !hotelTypes.includes(hotel.type)) return false;
    // Amenities filter
    if (
      amenities.length > 0 &&
      !amenities.every(a => hotel.amenities.some((am: { name: string }) => am.name === a))
    ) return false;
    return true;
  });

  return (
    <>
      <SearchSummary searchData={searchData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 h-screen min-h-0">
          <FilterSidebar
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            hotelTypes={hotelTypes}
            setHotelTypes={setHotelTypes}
            amenities={amenities}
            setAmenities={setAmenities}
          />
          <div className="flex-1 h-full overflow-y-auto">
            {loading && <ResultsSkeleton count={6} />}
            {!loading && error && (
              <div className="text-center text-red-600 py-10">{error}</div>
            )}
            {!loading && !error && (
              <Results hotels={filteredHotels} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchResult