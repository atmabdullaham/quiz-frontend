import { FaTrophy } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

const Prize = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 py-12 md:py-20 ">
      <div className=" px-2 md:px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <FaTrophy className="text-2xl md:text-4xl mx-auto mb-4 md:mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            পুরস্কার এবং স্বীকৃতি
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            প্রতি মাসের প্রশ্নোত্তর প্রতিযোগিতায় অংশগ্রহণ করুন এবং আকর্ষণীয়
            পুরস্কার জিতে নাও।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-4 md:my-8">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl border border-purple-400 ">
              <p className="text-5xl font-bold mb-2">🥇</p>
              <p className="text-lg font-semibold mb-2 text-purple-600">
                প্রথম স্থান
              </p>
              <p className="">বিশেষ সম্মাননা এবং পুরস্কার</p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-xl border border-pink-400">
              <p className="text-5xl font-bold mb-2">🥈</p>
              <p className="text-lg font-semibold mb-2 text-pink-600">
                দ্বিতীয় স্থান
              </p>
              <p className="">মূল্যবান উপহার এবং সম্মাননাপত্র</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-xl border border-green-400">
              <p className="text-5xl font-bold mb-2">🥉</p>
              <p className="text-lg font-semibold mb-2 text-green-600">
                তৃতীয় স্থান
              </p>
              <p className="">পুরস্কার এবং স্মারক</p>
            </div>
          </div>
          <Link
            to="/quizzes"
            className=" btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-base py-3 rounded-xl "
          >
            কুইজ দাও <MdOutlineArrowOutward className="text-sm md:text-lg" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Prize;
