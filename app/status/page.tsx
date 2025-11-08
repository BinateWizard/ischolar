export default function StatusPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track your application</h1>
        <p className="text-gray-600 mb-6">Enter your Application ID or Student Number to check your status.</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="ref" className="block text-sm font-medium text-gray-700 mb-1">Application ID / Student No.</label>
            <input
              id="ref"
              type="text"
              placeholder="e.g. APP-2025-00123 or 2021-12345"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Check Status
          </button>
        </form>
      </div>
    </div>
  );
}
