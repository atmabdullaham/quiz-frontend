import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const QuickAction = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12 md:py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              জ্ঞান এবং চরিত্রের নিখুঁত সমন্বয়
            </h2>
            <p className="text-base md:text-lg text-blue-200 max-w-3xl mx-auto">
              আমরা বিশ্বাস করি যে শুধু পড়াশোনা নয়, বরং সার্বিক উন্নয়নই প্রকৃত
              শিক্ষা।
            </p>
          </div>

          {/* Main Content Grid */}

          {/* Key Values */}
          <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-12 md:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                  ⏰
                </div>
                <p className="text-white font-semibold text-sm md:text-base">
                  সময়ানুবর্তিতা
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                  📚
                </div>
                <p className="text-white font-semibold text-sm md:text-base">
                  শৃঙ্খলাবোধ
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                  ✅
                </div>
                <p className="text-white font-semibold text-sm md:text-base">
                  দায়বদ্ধতা
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                  🎯
                </div>
                <p className="text-white font-semibold text-sm md:text-base">
                  লক্ষ্যভিত্তিক
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link
              to="/quizzes"
              className="group relative px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-base md:text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 md:gap-3 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2 md:gap-3">
                🚀 কুইজ দাও
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/login"
              className="group relative px-6 md:px-10 py-3 md:py-4 bg-white/10 border-2 border-white/30 text-white font-bold text-base md:text-lg rounded-xl hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-105 flex items-center gap-2 md:gap-3 backdrop-blur-sm"
            >
              <span className="relative flex items-center gap-2 md:gap-3">
                👤 সদস্য হও
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAction;
