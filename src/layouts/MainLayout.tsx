import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

/**
 * @param {{ children: React.ReactNode }} props
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
