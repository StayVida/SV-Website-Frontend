import { Shield,UserCheck,Headphones,CheckCircle } from "lucide-react"

function WhyChoose() {
  return (
          <section className="py-12 bg-gray-50">
          <div className="px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 md:mb-10 text-center">Why Choose StayVida</h2>
  
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Verified Hotels</h3>
                <p className="text-xs text-gray-600">Quality assured stays</p>
              </div>
  
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Local Guides</h3>
                <p className="text-xs text-gray-600">Expert assistance</p>
              </div>
  
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Headphones className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">24/7 Support</h3>
                <p className="text-xs text-gray-600">Always here to help</p>
              </div>
  
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Secure Booking</h3>
                <p className="text-xs text-gray-600">Safe transactions</p>
              </div>
            </div>
          </div>
        </section>
  )
}

export default WhyChoose