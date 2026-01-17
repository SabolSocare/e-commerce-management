// Loading components for various UI elements

export const PageLoader = () => (
  <div className="h-full flex items-center justify-center bg-[#F9F9FC]">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3A5BFF] border-t-transparent"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
)

export const ButtonLoader = ({ className = "" }) => (
  <div className={`inline-flex items-center gap-2 ${className}`}>
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
    <span>Loading...</span>
  </div>
)

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="animate-pulse space-y-4">
    {/* Header */}
    <div className="flex gap-4">
      {[...Array(cols)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded flex-1"></div>
      ))}
    </div>
    
    {/* Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {[...Array(cols)].map((_, colIndex) => (
          <div key={colIndex} className="h-12 bg-gray-100 rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
)

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg p-6 shadow">
    <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-100 rounded"></div>
      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      <div className="h-4 bg-gray-100 rounded w-4/6"></div>
    </div>
  </div>
)
