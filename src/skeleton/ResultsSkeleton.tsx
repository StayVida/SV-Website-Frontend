import React from "react"

interface ResultsSkeletonProps {
  count?: number
}

const ResultsSkeleton: React.FC<ResultsSkeletonProps> = ({ count = 6 }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="h-48 w-full bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsSkeleton


