import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      // Error toast is already shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 md:w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-5 md:w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}

          {/* Card Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-10 ">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                স্বাগতম!
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                কিশোরকণ্ঠ পাঠক ফোরাম - চট্টগ্রাম মহানগর উত্তর
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>

            {/* Info Section */}
            <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/80 text-sm leading-relaxed text-center">
                গুগলের মাধ্যমে সাইন ইন করো এবং প্রতিযোগিতামূলক কুইজে অংশ নাও
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn btn-lg w-full bg-purple-100 text-purple-600 border-0 gap-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mb-4 font-semibold"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <FaGoogle className="text-lg" />
                  গুগল দিয়ে লগইন করো
                </>
              )}
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-xs md:text-sm mb-3">
              তোমার তথ্য নিরাপদে রাখা হবে।
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                শর্তাবলী
              </a>
              <span className="text-white/30">•</span>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                গোপনীয়তা
              </a>
              <span className="text-white/30">•</span>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                সহায়তা
              </a>
            </div>
          </div>

          {/* Branding */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-white/50 text-xs">
              <MdQuiz className="text-lg text-purple-300" />
              <span>কিশোরকণ্ঠ পাঠক ফোরাম</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
