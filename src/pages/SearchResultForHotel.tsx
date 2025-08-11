import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SearchSummary from "@/features/searchResult/SearchSummary"
import FilterSidebar from "@/features/searchResult/FilterSidebar"
import Results from "@/features/searchResult/Results"
import hotelData from "@/data.json"

interface SearchData {
  destination: string
  checkIn: string
  checkOut: string
  adults: string
  children: string
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

  useEffect(() => {
    // Get search parameters from route params
    setSearchData({
      destination: params.destination || "Goa, India",
      checkIn: params.checkIn || "15 Mar",
      checkOut: params.checkOut || "18 Mar",
      adults: params.adults || "2",
      children: params.children || "0",
    })
  }, [params])

  // Filtering logic (first by searchData, then by sidebar filters)
  const searchFilteredHotels = (hotelData as any[]).filter(hotel => {
    // Destination filter (simple contains, case-insensitive)
    if (searchData.destination && !hotel.destination.toLowerCase().includes(searchData.destination.toLowerCase())) return false;
    // You can add more searchData-based filters here if needed (e.g., checkIn, checkOut, adults, children)
    return true;
  });

  const filteredHotels = searchFilteredHotels.filter(hotel => {
    // Price filter (one directional: 0 to maxPrice)
    const price = hotel.pricePerNight || hotel.price || 0;
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
          <Results hotels={filteredHotels} />
        </div>
      </div>
    </>
  )
}

export default SearchResult