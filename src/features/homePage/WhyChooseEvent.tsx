import { CheckCircle,Palette,UserCheck } from "lucide-react"

function WhyChooseEvent() {
  return (
    <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose StayVida?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">End-to-end planning</h3>
              <p className="text-gray-600 text-sm">
                Professional service ensuring your event runs smoothly from start to finish
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">In-house decoration & catering</h3>
              <p className="text-gray-600 text-sm">
                Professional service for your wedding your event runs smoothly from start to finish
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">On-site event managers</h3>
              <p className="text-gray-600 text-sm">
                Dedicated event managers on-site to ensure everything runs smoothly from start to finish
              </p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default WhyChooseEvent