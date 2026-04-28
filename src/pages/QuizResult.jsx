import { useQuery } from "@tanstack/react-query";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios";
import {
  formatBangladeshiDateTime,
  formatTimeTaken,
} from "../utils/bangladeshiDate";
import { convertUTCToBangladesh } from "../utils/timezoneConverter";

const QuizResult = ({ user }) => {
  const { id } = useParams();

  const { data: submission, isLoading } = useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/quizzes/${id}/submission`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-purple-400"></div>
          <p className="mt-4 text-lg text-white">Loading results...</p>
        </div>
      </div>
    );
  }

  const percentage = (
    (submission.score / submission.totalQuestions) *
    100
  ).toFixed(1);
  const correctAnswers = (
    submission.userAnswers ||
    submission.answers ||
    []
  ).filter((a) => a.isCorrect).length;
  const incorrectAnswers = (
    submission.userAnswers ||
    submission.answers ||
    []
  ).filter((a) => !a.isCorrect).length;

  // VERSION 2: Check if answers are locked
  const answersLocked = submission.answersLocked === true;

  const formatTime = (seconds) => {
    return formatTimeTaken(seconds, false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 md:py-4 py-6 px-2 md:px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-6">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-medium md:font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Quiz Complete!
            </h1>
            <p className="text-xl text-purple-200">আপনার ফলাফল</p>
          </div>
        </div>

        {/* Main Score Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-1">
            <div className="bg-slate-900 rounded-3xl p-12 text-center backdrop-blur-md">
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
                      stroke="rgba(168, 85, 247, 0.1)"
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
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      {percentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Score */}
              <div className="mt-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {submission.score} / {submission.totalQuestions}
                </h2>
                <p className="text-lg text-purple-300">আপনার মোট স্কোর</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Correct Answers */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-2">
                  সঠিক উত্তর
                </p>
                <h3 className="text-4xl font-bold text-white">
                  {correctAnswers}
                </h3>
              </div>
              <FaCheckCircle className="text-5xl text-emerald-200 opacity-30" />
            </div>
          </div>

          {/* Incorrect Answers */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-2">
                  ভুল উত্তর
                </p>
                <h3 className="text-4xl font-bold text-white">
                  {incorrectAnswers}
                </h3>
              </div>
              <FaTimesCircle className="text-5xl text-red-200 opacity-30" />
            </div>
          </div>

          {/* Time Taken */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">
                  সময় ব্যয়
                </p>
                <h3 className="text-3xl font-bold text-white">
                  {formatTime(submission.timeTaken)}
                </h3>
              </div>
              <FaClock className="text-5xl text-blue-200 opacity-30" />
            </div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-500 border-opacity-20">
          <h3 className="text-lg font-semibold text-white mb-6">
            পারফরম্যান্স বিশ্লেষণ
          </h3>
          <div className="space-y-6">
            {/* Correct Progress */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-purple-300 font-medium">সঠিক প্রশ্ন</span>
                <span className="text-emerald-400 font-bold">
                  {correctAnswers}/{submission.totalQuestions}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(correctAnswers / submission.totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Incorrect Progress */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-purple-300 font-medium">ভুল প্রশ্ন</span>
                <span className="text-red-400 font-bold">
                  {incorrectAnswers}/{submission.totalQuestions}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(incorrectAnswers / submission.totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-500 border-opacity-20">
          <p className="text-purple-300 text-sm mb-2">
            জমা দেওয়ার সময় (বাংলাদেশ সময়)
          </p>
          <p className="text-xl font-semibold text-white">
            {formatBangladeshiDateTime(
              convertUTCToBangladesh(new Date(submission.submittedAt)),
            )}
          </p>
        </div>

        {/* VERSION 2: Answer Locking Message */}
        {answersLocked && (
          <div className="bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-400 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📝</div>
              <div>
                <p className="text-yellow-100">
                  ফলাফল প্রকাশ করার পরে, সঠিক উত্তর দেখা যাবে।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quizzes"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            আরও কুইজ দেখুন
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link
            to="/results"
            className="flex items-center justify-center px-8 py-4 bg-slate-700 text-purple-300 font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300 border border-purple-500 border-opacity-30 hover:border-opacity-60"
          >
            সকল ফলাফল দেখুন
          </Link>
        </div>

        {/* Motivational Message */}
      </div>
    </div>
  );
};

export default QuizResult;
