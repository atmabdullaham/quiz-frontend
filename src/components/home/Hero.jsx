import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo3.jpg";

const Hero = () => {
  return (
    <div className="hero min-h-[60vh] bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 relative overflow-visible pb-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 md:w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-5 md:w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="hero-content px-2 relative z-10 w-full text-center  md:text-left py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center w-full max-w-7xl mx-auto px-4">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl py-1 md:text-4xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                কিশোরকণ্ঠ পাঠক ফোরাম
              </h2>
              <p className="text-sm md:text-base font-semibold text-blue-100">
                চট্টগ্রাম মহানগর উত্তর
              </p>
            </div>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed md:max-w-md text-justify">
              পড়ালেখার পাশাপাশি জ্ঞানের ভাণ্ডারকে আরো সমৃদ্ধ করতে কিশোরকণ্ঠ পাঠক
              ফোরাম চট্টগ্রাম মহানগর উত্তর প্রতি মাসের শেষ সপ্তাহে মাসিক নতুন
              কিশোরকন্ঠের উপর "কিশোরকন্ঠ মাসিক পাঠ প্রতিযোগিতা" র আয়োজন করে।
              যেখানে আকর্ষণীয় পুরস্কারের ব্যবস্থা আছে।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <Link
                to="/quizzes"
                className="btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-base py-3 rounded-xl "
              >
                কুইজ দাও{" "}
                <MdOutlineArrowOutward className="text-sm md:text-lg" />
              </Link>
              <Link
                to="/login"
                className="btn px-4 py-3 rounded-xl  bg-purple-600 text-white border-purple-600 font-semibold"
              >
                সদস্য হও
                <MdOutlineArrowOutward className="text-sm md:text-lg" />
              </Link>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="hidden md:flex justify-center">
            <img
              src={logoImg}
              alt="Logo"
              className="w-48 md:w-56 lg:w-64 h-48 md:h-56 lg:h-64 object-contain rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Wave Transition */}
      <div className="absolute -bottom-1 left-0 right-0 w-full h-24 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
