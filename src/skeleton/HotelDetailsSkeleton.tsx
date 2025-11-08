import React from "react"

const HotelDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Gallery Skeleton */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-64 md:h-96">
          <div className="md:col-span-2 row-span-2 bg-gray-200 rounded-lg animate-pulse" />
          <div className="bg-gray-200 rounded-lg animate-pulse" />
          <div className="bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hotel Info Skeleton */}
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Property Overview Skeleton */}
          <div className="space-y-3">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Amenities Skeleton */}
          <div className="space-y-4">
            <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="h-6 w-6 bg-gray-200 rounded mx-auto animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Room List Skeleton */}
          <div className="space-y-4">
            <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 bg-gray-200 animate-pulse" />
                  <div className="flex-1 p-4 sm:p-6 space-y-3">
                    <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetailsSkeleton

