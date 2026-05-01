import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

const QuickAction = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 py-12 md:py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-10 w-72 h-72  rounded-full "></div>
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
      <div className="container mx-auto px-2 md:px-4 relative z-10">
        <div className="max-w-6xl  mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              আমাদের লক্ষ্য ও উদ্দেশ্য
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              জ্ঞান এবং চরিত্রের নিখুঁত সমন্বয়
            </p>
          </div>

          <article class="rounded-xl bg-white  p-4 ring-3 ring-indigo-50 sm:p-6 lg:p-8">
            <div class="flex items-start sm:gap-8">
              <div
                class="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500"
                aria-hidden="true"
              >
                <div class="flex items-center gap-1">
                  <span class="h-8 w-0.5 rounded-full bg-indigo-500"></span>
                  <span class="h-6 w-0.5 rounded-full bg-indigo-500"></span>
                  <span class="h-4 w-0.5 rounded-full bg-indigo-500"></span>
                  <span class="h-6 w-0.5 rounded-full bg-indigo-500"></span>
                  <span class="h-8 w-0.5 rounded-full bg-indigo-500"></span>
                </div>
              </div>

              <div>
                <h3 class="mt-4 text-lg font-medium sm:text-xl">
                  মেধা ও মননের বিকাশ এবং দেশপ্রেম ও চারিত্রিক মূল্যবোধ সৃষ্টি,
                  শৃঙ্খলাবোধ, সময়ানুবর্তিতা ও কর্তব্যবোধে উজ্জীবিতকরণ
                </h3>

                <p class="mt-1 text-sm text-gray-700"></p>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex gap-4 md:gap-6 justify-center py-2 items-center">
              <Link
                to="/quizzes"
                className="flex-1 md:flex-none btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-base py-3 rounded-xl "
              >
                কুইজ দাও
                <MdOutlineArrowOutward className="text-sm md:text-lg" />
              </Link>

              <Link
                to="/login"
                className="flex-1 md:flex-none btn px-4 py-3 rounded-xl  bg-purple-600 text-white border-purple-600 font-semibold"
              >
                সদস্য হও
                <MdOutlineArrowOutward className="text-sm md:text-lg" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default QuickAction;
