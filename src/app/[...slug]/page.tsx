import { notFound } from "next/navigation";
import { Metadata } from "next";
import HotelDetailsSEO from "@/components/hotelDetails/HotelDetailsSEO";

// Define our known property types
const PROPERTY_TYPES = ["hotels", "resorts", "villas", "homestays"];

type Props = {
  params: Promise<{ slug?: string[] }>
};

async function getHotelData(id: string) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkInDate = today.toISOString().split('T')[0];
    const checkOutDate = tomorrow.toISOString().split('T')[0];
    
    const url = `${API_BASE}/hotels/${id}/rooms?checkIn=${checkInDate}&checkOut=${checkOutDate}`;
    
    const response = await fetch(url, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY || "",
      },
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch property:", error);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  if (!slug || slug.length === 0) return {};
  
  // Case 1: /[property-type]/[hotel-slug]
  if (slug.length === 2 && PROPERTY_TYPES.includes(slug[0].toLowerCase())) {
    const type = decodeURIComponent(slug[0]);
    const lastSegment = slug[1];
    
    // Extract ID safely
    let id = "";
    if (lastSegment.includes('_')) {
      id = lastSegment.split('_')[0];
    } else {
      const parts = lastSegment.split('-');
      if (parts[0] === 'H' && parts.length > 1) {
        id = `${parts[0]}-${parts[1]}`;
      } else {
        id = parts[0];
      }
    }

    const hotelResponse = await getHotelData(id);
    const hotel = hotelResponse?.data || hotelResponse;
    
    if (hotel && hotel.name) {
      return {
        title: `${hotel.name} | ${type.charAt(0).toUpperCase() + type.slice(1, -1)} in ${hotel.destination || hotel.location || 'Mahabaleshwar'}`,
        description: `${hotel.name} in ${hotel.destination || hotel.location || 'Mahabaleshwar'}. Check rooms, amenities, location, photos and availability on StayVida.`,
        alternates: {
          canonical: `https://www.stayvida.in/${type}/${lastSegment}`,
        },
        openGraph: {
          title: `${hotel.name} | StayVida`,
          description: `${hotel.name} in ${hotel.destination || hotel.location || 'Mahabaleshwar'}. Check rooms, amenities, location, photos and availability on StayVida.`,
          url: `https://www.stayvida.in/${type}/${lastSegment}`,
          images: hotel.images && hotel.images.length > 0 ? [
            {
              url: hotel.images[0].startsWith('http') ? hotel.images[0] : `https://www.stayvida.in${hotel.images[0]}`,
              width: 1200,
              height: 630,
              alt: hotel.name,
            },
          ] : [],
        },
      };
    }
    
    return {
      title: "Property Not Found | StayVida",
    };
  }

  // Case 2: /[location]/[property-type]
  if (slug.length === 2 && PROPERTY_TYPES.includes(slug[1].toLowerCase())) {
    const location = decodeURIComponent(slug[0]).replace(/-/g, ' ');
    const type = decodeURIComponent(slug[1]);
    return {
      title: `Best ${type} in ${location} - StayVida`,
      description: `Find and book the best ${type} in ${location}. Great deals and offers on StayVida.`,
    };
  }
  
  // Case 3: /[location]
  if (slug.length === 1 && !PROPERTY_TYPES.includes(slug[0].toLowerCase())) {
    const location = decodeURIComponent(slug[0]).replace(/-/g, ' ');
    return {
      title: `Places to stay in ${location} - StayVida`,
      description: `Discover top-rated accommodations, resorts, and hotels in ${location} on StayVida.`,
    };
  }
  
  return {};
}

export default async function SEOPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug || slug.length === 0) {
    return notFound();
  }

  if (slug[0] === "blog") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Blog: {slug[1]}</h1>
        <p className="mt-4 text-gray-600">Blog detail pages are coming soon.</p>
      </div>
    );
  }

  // Case 1: /[property-type]/[hotel-slug]
  if (slug.length === 2 && PROPERTY_TYPES.includes(slug[0].toLowerCase())) {
    const type = slug[0];
    const lastSegment = slug[1];
    
    // Extract ID safely
    let id = "";
    if (lastSegment.includes('_')) {
      id = lastSegment.split('_')[0];
    } else {
      const parts = lastSegment.split('-');
      if (parts[0] === 'H' && parts.length > 1) {
        id = `${parts[0]}-${parts[1]}`;
      } else {
        id = parts[0];
      }
    }

    const hotelResponse = await getHotelData(id);
    const hotel = hotelResponse?.data || hotelResponse;

    if (!hotel || !hotel.name) {
      return notFound();
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": hotel.name,
      "description": hotel.description,
      "image": hotel.images || [],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotel.destination || hotel.location || "Mahabaleshwar",
        "addressCountry": "IN"
      },
      "telephone": hotel.phoneNo,
      "priceRange": "₹₹",
      "amenityFeature": hotel.amenities?.map((a: string) => ({
        "@type": "LocationFeatureSpecification",
        "name": a,
        "value": true
      }))
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stayvida.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": hotel.destination || hotel.location || "Mahabaleshwar",
          "item": `https://www.stayvida.in/hotels?location=${hotel.destination || hotel.location || 'Mahabaleshwar'}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": hotel.name,
          "item": `https://www.stayvida.in/${type}/${lastSegment}`
        }
      ]
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What are the check-in and check-out times at ${hotel.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check-in is typically from 2:00 PM, and check-out is until 11:00 AM. Please contact the property directly for early check-in or late check-out requests."
          }
        },
        {
          "@type": "Question",
          "name": `Is ${hotel.name} suitable for families?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, ${hotel.name} is a great choice for families visiting ${hotel.destination || 'the area'}, offering comfortable accommodations and various amenities suitable for group stays.`
          }
        }
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <HotelDetailsSEO initialData={hotelResponse} />
      </>
    );
  }
  
  // Case 2: /[location]/[property-type]
  // e.g. /mahabaleshwar/resorts
  if (slug.length === 2 && PROPERTY_TYPES.includes(slug[1].toLowerCase())) {
    const location = decodeURIComponent(slug[0]);
    const type = decodeURIComponent(slug[1]);
    
    // For now, we will render a placeholder or redirect to search.
    // In a full implementation, you would fetch and render SEO-friendly cards here.
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold capitalize mb-8">{type} in {location.replace(/-/g, ' ')}</h1>
          <p className="text-gray-600">Browse the best {type} for your stay in {location.replace(/-/g, ' ')}.</p>
          <div className="mt-8 p-8 bg-white rounded-lg shadow text-center">
             <p className="text-gray-500">Listings for {type} in {location} will appear here. (SEO Category Page under construction)</p>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: /[location]
  // e.g. /mahabaleshwar
  // Note: We check that it's NOT a property type, to avoid conflict if someone types /hotels (though Next handles that via app/hotels/page.tsx)
  if (slug.length === 1 && !PROPERTY_TYPES.includes(slug[0].toLowerCase())) {
    const location = decodeURIComponent(slug[0]);
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold capitalize mb-8">Places to stay in {location.replace(/-/g, ' ')}</h1>
          <p className="text-gray-600">Discover top-rated accommodations, resorts, and hotels in {location.replace(/-/g, ' ')}.</p>
          <div className="mt-8 p-8 bg-white rounded-lg shadow text-center">
             <p className="text-gray-500">Destination guide for {location} will appear here. (SEO Location Page under construction)</p>
          </div>
        </div>
      </div>
    );
  }

  // If none of the patterns matched, return a 404
  return notFound();
}
