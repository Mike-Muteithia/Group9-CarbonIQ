import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-center p-6">
      {/* Big 404 Text */}
      <h1 className="text-9xl font-extrabold text-green-500 drop-shadow-lg animate-pulse">
        404
      </h1>

      {/* Message */}
      <h2 className="text-3xl font-bold text-gray-800 mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you’re looking for might have been moved, deleted, or doesn’t
        exist anymore.
      </p>

      {/* Illustration or emoji */}
      <div className="mt-8 text-6xl animate-bounce">🌱</div>

      {/* Button back to dashboard */}
      <a
        href="/dashboard"
        className="mt-10 inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition-all"
      >
        Go Back to Dashboard
      </a>

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-8">
        © {new Date().getFullYear()} CarbonIQ
      </p>
    </div>
  );
}
