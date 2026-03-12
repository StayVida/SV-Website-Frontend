import { Building, Instagram, MessageCircle, Facebook } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StayVida</span>
            </Link>
            <p className="text-green-100 mb-4">Your one-stop solution for travel and event planning.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-green-100 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/hotels" className="text-green-100 hover:text-white transition-colors">Hotels</Link></li>
              <li><Link to="/events" className="text-green-100 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/about" className="text-green-100 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-green-100 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-green-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-green-100 hover:text-white transition-colors">
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
              <Link to="#" className="text-green-100 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link to="#" className="text-green-100 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link to="#" className="text-green-100 hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-green-800 mt-8 lg:mt-12 pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-green-100 text-sm">© 2024 StayVida. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-green-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-green-400 hover:text-white text-sm transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer