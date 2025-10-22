function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center">
      <h1 className="text-5xl font-extrabold text-emerald-400 mb-4">
        CarbonIQ 🌱
      </h1>
      <p className="text-lg text-gray-300 max-w-md">
        Track, analyze, and reduce your carbon footprint with AI-driven insights.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="#signup"
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition"
        >
          Get Started
        </a>
        <a
          href="#learn"
          className="px-6 py-3 border border-emerald-400 text-emerald-400 rounded-xl font-semibold hover:bg-emerald-400 hover:text-slate-900 transition"
        >
          Learn More
        </a>
        <div className="p-10 bg-red-500 text-white rounded-xl">
            Tailwind is working! 🚀
        </div>
      </div>
    </main>
  );
}

export default App;
