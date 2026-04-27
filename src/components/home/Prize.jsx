import { FaArrowRight, FaTrophy } from "react-icons/fa";
import { Link } from "react-router-dom";

const Prize = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 md:py-20">
      <div className="px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <FaTrophy className="text-6xl md:text-8xl mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
            পুরস্কার এবং স্বীকৃতি
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-white/90 leading-relaxed">
            প্রতি মাসের প্রশ্নোত্তর প্রতিযোগিতায় অংশগ্রহণ করুন এবং আকর্ষণীয়
            পুরস্কার জিতে নাও।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/30">
              <p className="text-5xl font-bold mb-2">🥇</p>
              <p className="text-lg font-semibold mb-2">প্রথম স্থান</p>
              <p className="text-white/80">বিশেষ সম্মাননা এবং পুরস্কার</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/30">
              <p className="text-5xl font-bold mb-2">🥈</p>
              <p className="text-lg font-semibold mb-2">দ্বিতীয় স্থান</p>
              <p className="text-white/80">মূল্যবান উপহার এবং সম্মাননাপত্র</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/30">
              <p className="text-5xl font-bold mb-2">🥉</p>
              <p className="text-lg font-semibold mb-2">তৃতীয় স্থান</p>
              <p className="text-white/80">পুরস্কার এবং স্মারক</p>
            </div>
          </div>
          <Link
            to="/quizzes"
            className="btn btn-sm md:btn-lg bg-white text-orange-600 hover:bg-gray-100 border-0 shadow-xl gap-2 font-semibold"
          >
            কুইজ দাও <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Prize;
