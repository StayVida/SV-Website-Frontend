import { Building,Instagram,MessageCircle,Facebook } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-white py-8 lg:bg-green-900 lg:text-white lg:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-900 lg:text-white">StayVida</span>
          </div>
          <p className="text-green-700 lg:text-green-100 mb-4">Your one-stop solution for travel and event planning.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-900 lg:text-white">Quick Link</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
                Our Services
              </Link>
            </li>
            <li>
              <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
                Featured Properties
              </Link>
            </li>
            <li>
              <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-900 lg:text-white">Contact</h3>
          <div className="space-y-2">
            <p className="text-green-700 lg:text-green-100">Opp. Siddhu's Event's,</p>
            <p className="text-green-700 lg:text-green-100">Mahalakshwar,</p>
            <p className="text-green-700 lg:text-green-100">Maharashtra 412806</p>
            <p className="text-green-700 lg:text-green-100">+91 094057 58183</p>
            <p className="text-green-700 lg:text-green-100">info@stayvida.com</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-900 lg:text-white">Follow Us</h3>
          <div className="flex space-x-4">
            <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link to="#" className="text-green-700 lg:text-green-100 hover:text-primary lg:hover:text-white">
              <MessageCircle className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-green-200 lg:border-green-800 mt-8 lg:mt-12 pt-6 lg:pt-8">
        <p className="text-center text-green-700 lg:text-green-100 text-sm">© 2024 StayVida. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer