import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import ProfilePage from "./pages/Profile";
import RegisterProperty from "./pages/RegisterProperty";
import BookingDetails from "./pages/BookingDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelsPages />} />
          <Route path="/events" element={<EventsPages />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register-property" element={<RegisterProperty />} />
          <Route path="/search/:destination/:checkIn/:checkOut/:adults/:children" element={<SearchResult />} />
          <Route path="/events/search" element={<SearchResultForEvent />} />
          <Route path="/hotel/:id/:checkIn/:checkOut/:adults/:children" element={<HotelDetails />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes; 