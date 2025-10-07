import { Routes, Route } from "react-router-dom";
// Import your page components here
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import PageNotFound from "./layouts/PageNotFound";
import SearchResult from "./pages/SearchResultForHotel";
import SearchResultForEvent from "./pages/SearchResultForEvent";
import HotelDetails from "./pages/hotelDetails";
import HotelsPages from "./pages/HotelsPages";
import EventsPages from "./pages/EventsPages";
import About from "./pages/About";
import Contact from "./pages/Contact";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPages />} />
        <Route path="/events" element={<EventsPages />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search/:destination/:checkIn/:checkOut/:adults/:children" element={<SearchResult />} />
        <Route path="/events/search" element={<SearchResultForEvent />} />
        <Route path="/hotel/:id/:checkIn/:checkOut/:adults/:children" element={<HotelDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 