import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Hotel } from "@/types/hotelType";


interface ImageGalleryProps {
  hotel: Hotel;
}

export default function ImageGallery({ hotel }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  // Auto-slider effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === hotel.images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, hotel.images.length]);

  // Pause auto-play when user interacts
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of no interaction
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  return (
    <div className="mb-8">
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {/* Left side - Single main image */}
        <div className="col-span-1">
          <div className="relative h-80 rounded-lg overflow-hidden">
            <img
              src={hotel.images[0] || "/placeholder.svg"}
              alt="Main hotel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Right side - 2x2 grid */}
        <div className="col-span-1 grid grid-cols-2 gap-2">
          {hotel.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative h-[156px] rounded-lg overflow-hidden"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Hotel image ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout - Slider */}
      <div className="md:hidden">
        <div className="relative">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={hotel.images[currentImageIndex] || "/placeholder.svg"}
              alt={`Hotel image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows */}
            <button
              onClick={() => {
                prevImage();
                handleUserInteraction();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                nextImage();
                handleUserInteraction();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {hotel.images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  handleUserInteraction();
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-gray-800"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
