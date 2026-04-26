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
      // console.error("Login error:", error);
      // Error toast is already shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <MdQuiz className="text-4xl text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3 text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to continue your quiz journey
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-lg w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing in...
              </>
            ) : (
              <>
                <FaGoogle className="text-xl text-red-500" />
                Continue with Google
              </>
            )}
          </button>

          {/* Troubleshooting Info */}
          {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <p className="text-xs font-semibold text-blue-800 mb-2">
              🔧 Login Issues?
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Make sure popup blockers are disabled</li>
              <li>• Check if Firebase is configured correctly</li>
              <li>• Verify Google Auth is enabled in Firebase</li>
              <li>• Check browser console (F12) for errors</li>
            </ul>
          </div> */}

          <div className="mt-6 text-sm text-gray-500">
            <p>By continuing, you agree to our</p>
            <p className="mt-1">
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>
              {" & "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-white">
          <p className="text-sm">
            New to QuizMaster? Start your journey today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
