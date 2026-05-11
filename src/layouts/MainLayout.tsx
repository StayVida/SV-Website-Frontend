import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

/**
 * @param {{ children: React.ReactNode }} props
 */
const MainLayout = () => {
  const location = useLocation();
  const isHeroPage = ["/", "/about", "/contact"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className={cn("flex-1", !isHeroPage && "pt-16 md:pt-20")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
