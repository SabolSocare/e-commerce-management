export default function ComingSoon({ title }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-lg">Coming Later</p>
      </div>
    </div>
  )
}
