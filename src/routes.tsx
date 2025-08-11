import { Routes, Route } from "react-router-dom";
// Import your page components here
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import PageNotFound from "./layouts/PageNotFound";
import SearchResult from "./pages/SearchResultForHotel";
import HotelDetails from "./pages/hotelDetails";


function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search/:destination/:checkIn/:checkOut/:adults/:children" element={<SearchResult />} />
        <Route path="/hotel/:id/:checkIn/:checkOut/:adults/:children" element={<HotelDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 