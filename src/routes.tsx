import { Routes, Route } from "react-router-dom";
// Import your page components here
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import PageNotFound from "./layouts/PageNotFound";


function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 