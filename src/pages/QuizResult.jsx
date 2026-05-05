import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import {
  formatBangladeshiDateTime,
  formatTimeTaken,
} from "../utils/bangladeshiDate";
import { convertUTCToBangladesh } from "../utils/timezoneConverter";

const QuizResult = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: submission,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/quizzes/${id}/submission`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="mt-4 text-lg text-gray-700">Loading results...</p>
        </div>
      </div>
    );
  }

  // Check if submission data exists
  if (!submission || isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-2 md:py-4 px-2 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mt-20 text-center">
            <div className="inline-block p-4 md:p-8 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
              <FcCancel className="text-4xl md:text-8xl text-red-300"></FcCancel>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              ফলাফল পাওয়া যায়নি
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              দুঃখিত, তুমি কুইজটি জমা দাওনি
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <FaArrowLeft className="inline mr-2" />
                ফিরে যাও
              </button>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = (
    ((submission?.score || 0) / (submission?.totalQuestions || 1)) *
    100
  ).toFixed(1);
  const correctAnswers = (
    submission?.userAnswers ||
    submission?.answers ||
    []
  ).filter((a) => a?.isCorrect).length;
  const incorrectAnswers = (
    submission?.userAnswers ||
    submission?.answers ||
    []
  ).filter((a) => !a?.isCorrect).length;

  // VERSION 2: Check if answers are locked
  const answersLocked = submission?.answersLocked === true;

  const formatTime = (seconds) => {
    return formatTimeTaken(seconds, false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 md:py-4 py-6 px-2 md:px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-6">
          <div className="mb-8 animate-fade-in">
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              তোমার ফলাফল
            </p>
          </div>
        </div>

        {/* Main Score Card */}
        <div className="mb-8">
          <div className="">
            <div className="bg-white rounded-xl p-12 text-center backdrop-blur-md">
              {/* Circular Progress */}
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 200 200"
                  >
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.1)"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeDasharray={`${(percentage / 100) * 565.48} 565.48`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                      {percentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Score */}
              <div className="mt-8">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
                  {submission?.score || 0} / {submission?.totalQuestions || 0}
                </h2>
                <p className="text-lg text-gray-600">তোমার মোট স্কোর</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Correct Answers */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium mb-2">
                  সঠিক উত্তর
                </p>
                <h3 className="text-4xl font-bold text-emerald-600">
                  {correctAnswers}
                </h3>
              </div>
              <FaCheckCircle className="text-5xl text-emerald-300" />
            </div>
          </div>

          {/* Incorrect Answers */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium mb-2">
                  ভুল উত্তর
                </p>
                <h3 className="text-4xl font-bold text-red-600">
                  {incorrectAnswers}
                </h3>
              </div>
              <FaTimesCircle className="text-5xl text-red-300" />
            </div>
          </div>

          {/* Time Taken */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium mb-2">
                  সময় ব্যয়
                </p>
                <h3 className="text-3xl font-bold text-blue-600">
                  {formatTime(submission?.timeTaken || 0)}
                </h3>
              </div>
              <FaClock className="text-5xl text-blue-300" />
            </div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-blue-100 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            পারফরম্যান্স বিশ্লেষণ
          </h3>
          <div className="space-y-6">
            {/* Correct Progress */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">সঠিক প্রশ্ন</span>
                <span className="text-emerald-600 font-bold">
                  {correctAnswers}/{submission?.totalQuestions || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(correctAnswers / (submission?.totalQuestions || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Incorrect Progress */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">ভুল প্রশ্ন</span>
                <span className="text-red-600 font-bold">
                  {incorrectAnswers}/{submission?.totalQuestions || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(incorrectAnswers / (submission?.totalQuestions || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-purple-100 shadow-lg">
          <p className="text-gray-700 text-sm mb-2">
            জমা দেওয়ার সময় (বাংলাদেশ সময়)
          </p>
          <p className="text-xl font-semibold text-gray-900">
            {submission?.submittedAt
              ? formatBangladeshiDateTime(
                  convertUTCToBangladesh(new Date(submission.submittedAt)),
                )
              : "সময়ের তথ্য পাওয়া যায়নি"}
          </p>
        </div>

        {/* VERSION 2: Answer Locking Message */}
        {answersLocked && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📝</div>
              <div>
                <p className="text-blue-900 font-medium">
                  ফলাফল প্রকাশ করার পরে, সঠিক উত্তর দেখা যাবে।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/results"
            className="btn px-4 py-3 rounded-xl  bg-purple-600 text-white border-purple-600 font-semibold"
          >
            ফলাফল
          </Link>
        </div>

        {/* Motivational Message */}
      </div>
    </div>
  );
};

export default QuizResult;
