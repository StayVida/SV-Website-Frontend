import type { Hotel } from "@/types/hotelType";

interface ImageGalleryProps {
  hotel: Hotel;
}

export default function ImageGallery({ hotel }: ImageGalleryProps) {
  return (
    <div className="mb-8">
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.01]">
        <img
          src={hotel.images[0] || "/placeholder.svg"}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}
