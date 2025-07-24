import { Calendar,Users,Baby } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchData {
    destination: string
    checkIn: string
    checkOut: string
    adults: string
    children: string
  }

function SearchSummary({searchData}: {searchData: SearchData}) {
  return (
    <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{searchData.destination}</h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {searchData.checkIn} - {searchData.checkOut}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{searchData.adults} Adults</span>
                  {Number(searchData.children) > 0 && <>, <Baby className="w-4 h-4 mx-1" /><span>{searchData.children} children</span></>}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 lg:mt-0 border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
            >
              Modify Search
            </Button>
          </div>
        </div>
      </div>
  )
}

export default SearchSummary