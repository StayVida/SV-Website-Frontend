import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import IntroLoader from "./components/IntroLoader";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <IntroLoader>
          <AppRoutes />
        </IntroLoader>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
