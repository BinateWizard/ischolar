export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">iS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-tight">iScholar</span>
              <span className="text-xs text-gray-500">Scholarship Portal</span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="/apply" className="text-gray-600 hover:text-blue-600 transition-colors">Apply</a>
            <a href="/status" className="text-gray-600 hover:text-blue-600 transition-colors">Status</a>
            <a href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</a>
            <a href="/faqs" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</a>
            <a href="/signup" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Sign Up
            </a>
            <a href="/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
