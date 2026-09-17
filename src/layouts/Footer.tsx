import { Building, Instagram, MessageCircle, Facebook } from "lucide-react"
import Link from "next/link"

async function getFeaturedProperties() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";
    const response = await fetch(`${API_BASE}/hotels/featurelist`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY || "",
      },
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Failed to fetch properties for footer:", error);
  }
  return [];
}

export default async function Footer() {
  const properties = await getFeaturedProperties();

  // Group properties by type
  const hotels = properties.filter((p: any) => (p.type || "").toLowerCase() === "hotels");
  const resorts = properties.filter((p: any) => (p.type || "").toLowerCase() === "resorts");
  const villas = properties.filter((p: any) => (p.type || "").toLowerCase() === "villas");

  const generateSlug = (property: any, fallbackType: string) => {
    const id = property.id || property.hotelId || property._id;
    const name = property.name || "property";
    const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `/${fallbackType}/${id}_${slugName}`;
  };

  return (
    <footer className="bg-green-900 text-white py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SEO Directory Section for Internal Linking */}
        {/* <div className="mb-12 border-b border-green-800 pb-12">
          <h2 className="text-2xl font-bold mb-8 text-white">Explore StayVida</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-4">Hotels</h3>
              <ul className="space-y-3">
                {hotels.slice(0, 8).map((hotel: any) => (
                  <li key={hotel.id || hotel.hotelId}>
                    <Link href={generateSlug(hotel, 'hotels')} className="text-sm text-green-100 hover:text-white transition-colors">
                      {hotel.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-4">Resorts</h3>
              <ul className="space-y-3">
                {resorts.slice(0, 8).map((resort: any) => (
                  <li key={resort.id || resort.hotelId}>
                    <Link href={generateSlug(resort, 'resorts')} className="text-sm text-green-100 hover:text-white transition-colors">
                      {resort.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-4">Villas</h3>
              <ul className="space-y-3">
                {villas.slice(0, 8).map((villa: any) => (
                  <li key={villa.id || villa.hotelId}>
                    <Link href={generateSlug(villa, 'villas')} className="text-sm text-green-100 hover:text-white transition-colors">
                      {villa.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-4">Mahabaleshwar Guide</h3>
              <ul className="space-y-3">
                <li><Link href="/blog/places-to-visit" className="text-sm text-green-100 hover:text-white transition-colors">Places to Visit</Link></li>
                <li><Link href="/blog/things-to-do" className="text-sm text-green-100 hover:text-white transition-colors">Things to Do</Link></li>
                <li><Link href="/blog/best-time-to-visit" className="text-sm text-green-100 hover:text-white transition-colors">Best Time to Visit</Link></li>
                <li><Link href="/blog/travel-guide" className="text-sm text-green-100 hover:text-white transition-colors">Travel Guide</Link></li>
              </ul>
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StayVida</span>
            </Link>
            <p className="text-green-100 mb-4">Your one-stop solution for travel and event planning.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-green-100 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/hotels" className="text-green-100 hover:text-white transition-colors">Hotels</Link></li>
              <li><Link href="/events" className="text-green-100 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/about" className="text-green-100 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-green-100 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-green-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-green-100 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2">
              <p className="text-green-100 italic">Main market Mahabaleshwar,</p>
              <p className="text-green-100 italic">143, Dr Sabne Rd, Main market,</p>
              <p className="text-green-100 italic">Mahabaleshwar, Maharashtra 412806</p>
              <p className="text-green-100">+91 94057 58183</p>
              <p className="text-green-100">contact.stayvida@gmail.com</p>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-100 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-green-100 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-green-100 hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-green-800 mt-8 lg:mt-12 pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-green-100 text-sm">© 2024 StayVida. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-green-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-green-400 hover:text-white text-sm transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
