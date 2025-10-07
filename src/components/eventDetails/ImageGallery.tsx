import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Event {
  id: string;
  name: string;
  images: string[];
}

interface ImageGalleryProps {
  event: Event;
}

function ImageGallery({ event }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!event.images || event.images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="relative mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Main Image */}
          <div className="lg:col-span-3 relative">
            <img
              src={event.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${event.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 lg:h-[500px] object-cover rounded-l-xl cursor-pointer"
              onClick={openModal}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            
            {/* Navigation Arrows */}
            {event.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {event.images.length}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2">
            {event.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${event.name} - Thumbnail ${index + 1}`}
                className={`w-full h-24 lg:h-32 object-cover rounded-lg cursor-pointer transition-opacity ${
                  index === currentImageIndex ? "ring-2 ring-primary opacity-100" : "opacity-75 hover:opacity-100"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ))}
            {event.images.length > 4 && (
              <div 
                className="w-full h-24 lg:h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={openModal}
              >
                <span className="text-gray-600 text-sm">+{event.images.length - 4} more</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img
              src={event.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${event.name} - Full View`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            
            {event.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ImageGallery;