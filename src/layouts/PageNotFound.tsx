import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="mb-6">
        {/* Hotel-themed illustration (emoji for simplicity) */}
        <span className="text-7xl">🏨</span>
      </div>
      <h1 className="text-4xl font-bold mb-2 text-primary">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you are looking for doesn't exist.<br />
        Maybe you took a wrong turn at the lobby?
      </p>
      <Link to="/" className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
        Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
