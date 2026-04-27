import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaTrophy } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import NoticeMarquee from "../components/NoticeMarquee";
import axios from "../utils/axios";
import {
  formatBangladeshiDate,
  formatBangladeshiTime,
} from "../utils/bangladeshiDate";
import {
  convertUTCToBangladesh,
  getQuizStatusBangladesh,
  getSecondsUntilEnd,
} from "../utils/timezoneConverter";

const QuizList = ({ user }) => {
  const navigate = useNavigate();
  const [countdowns, setCountdowns] = useState({});

  const handleStartQuiz = (quizId) => {
    if (!user) {
      toast.error("কুইজ শুরু করতে লগইন করুন");
      navigate("/login");
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/quizzes");
      return data;
    },
    refetchInterval: 5000,
    staleTime: 0,
  });

  // Update countdowns every second for upcoming quizzes
  useEffect(() => {
    if (!quizzes) return;

    const timer = setInterval(() => {
      const newCountdowns = {};
      quizzes.forEach((quiz) => {
        const status = getQuizStatusBangladesh(quiz);
        if (status.text === "Upcoming") {
          const secondsLeft = getSecondsUntilEnd(quiz.endDate);
          newCountdowns[quiz._id] = Math.max(0, secondsLeft);
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizzes]);

  const getQuizStatus = (quiz) => {
    return getQuizStatusBangladesh(quiz);
  };

  const formatDate = (date) => {
    const bdDate = convertUTCToBangladesh(new Date(date));
    return formatBangladeshiDate(bdDate);
  };

  const formatTime = (date) => {
    const bdDate = convertUTCToBangladesh(new Date(date));
    return formatBangladeshiTime(bdDate);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status.text) {
      case "Active":
        return "badge-success animate-pulse";
      case "Upcoming":
        return "badge-info";
      case "Ended":
        return "badge-error";
      default:
        return "badge-warning";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="h-12 w-64 bg-white/20 rounded-xl mb-4"></div>
            <div className="h-6 w-96 bg-white/20 rounded-xl"></div>
          </div>
        </div>

        {/* Notice Marquee Skeleton */}
        <div className="h-16 bg-yellow-50 border-y-2 border-yellow-200 m-4 rounded-lg animate-pulse"></div>

        {/* Quiz Cards Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white shadow-lg"
              >
                <div className="h-1 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                  <div className="pt-4 border-t flex gap-3">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-2 md:gap-6 ">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <MdQuiz className="text-4xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">কুইজ</h1>
              <p className="text-white/90 text-lg mt-1">
                কিশোরকন্ঠ পাঠ প্রতিযোগিতা
              </p>
            </div>
          </div>

          {user ? (
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl inline-block border border-white/20">
              <p className="text-white font-semibold flex items-center gap-2">
                স্বাগতম,{" "}
                <span className="text-yellow-200">
                  {user.name.split(" ")[user.name.split(" ").length - 1]}
                </span>
                !
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl inline-block border border-blue-300/30">
                <p className="text-white font-semibold flex items-center gap-2">
                  <FaLock className="text-lg" />
                  <span>কুইজ শুরু করতে লগইন প্রয়োজন</span>
                  <Link
                    to="/login"
                    className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-bold"
                  >
                    এখনই লগইন করুন
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notice Marquee */}
      <NoticeMarquee displayLocation="quiz" />

      <div className="container mx-auto md:px-4 py-6 md:py-8">
        {quizzes?.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 shadow-lg">
              <MdQuiz className="text-8xl text-gray-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              কুইজ এখনও শুরু হয়নি
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              কুইজ শুরু হওয়ার সময় জানতে নোটিশ দেখো ।
            </p>
            <div className="space-y-3">
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                হোম
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Quizzes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes?.map((quiz) => {
                const status = getQuizStatus(quiz);
                const { subtitle } = quiz;
                const startTime = formatTime(quiz.startDate);
                const endTime = formatTime(quiz.endDate);
                const startDate = formatDate(quiz.startDate);
                const endDate = formatDate(quiz.endDate);

                return (
                  <div
                    key={quiz._id}
                    className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg  bg-white shadow-md"
                  >
                    {/* Card Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                    {/* Card Container */}
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-purple-200 transition-colors">
                      {/* Status Bar */}
                      <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                      {/* Header Section */}
                      <div className="p-6 pb-1 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 text-center">
                        <h2 className="text-2xl font-bold  line-clamp-2 text-purple-600 transition-colors">
                          {quiz.title}
                        </h2>

                        <div className="text-xs font-bold px-2.5 py-1 rounded-lg text-gray-700 ">
                          {subtitle}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-4">
                        {/* Description */}
                        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                          {quiz.description || " "}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-center">
                            <p className="text-xs text-gray-600 font-semibold mb-1">
                              📝 প্রশ্ন সংখ্যা
                            </p>
                            <p className="font-bold text-gray-800 text-lg">
                              {quiz.questions?.length || 0} টি
                            </p>
                          </div>
                          <div className="p-2 bg-purple-50 rounded-lg text-center">
                            <p className="text-xs text-gray-600 font-semibold mb-1">
                              ⏱️ সময়সীমা
                            </p>
                            <p className="font-bold text-gray-800 text-lg">
                              {quiz.timeLimit} মিনিট
                            </p>
                          </div>
                        </div>

                        {/* Timing Information */}
                        {quiz.startDate && quiz.endDate && (
                          <div className="space-y-2 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-amber-600 text-lg flex-shrink-0">
                                📅
                              </span>
                              <div>
                                <p className="font-semibold text-amber-900">
                                  শুরু হবে:{" "}
                                  <span className="text-gray-600">
                                    {startDate} - সময় {startTime}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-600 text-lg flex-shrink-0">
                                ⏰
                              </span>
                              <div>
                                <p className="font-semibold text-orange-900">
                                  শেষ হবে:{" "}
                                  <span className="text-gray-600">
                                    {endDate} - সময় {endTime}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="p-6 pt-1 border-t border-gray-100 flex gap-3">
                        {status.text === "Active" ? (
                          <>
                            {user ? (
                              <button
                                onClick={() => handleStartQuiz(quiz._id)}
                                className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-base py-3 rounded-xl transition-all duration-300  hover:shadow-purple-400/50 "
                              >
                                🚀 শুরু করো
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  toast.error("কুইজ শুরু করতে লগইন করো");
                                  navigate("/login");
                                }}
                                className="flex-1 btn bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                              >
                                <FaLock className="text-lg" />
                                <span>লগইন করো</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            className="flex-1 btn btn-disabled py-3 rounded-xl font-semibold"
                            disabled
                          >
                            {status.text === "Ended"
                              ? "❌ কুইজ শেষ"
                              : "🔒 শীঘ্রই আসছে"}
                          </button>
                        )}
                        <Link
                          to={`/quiz/${quiz._id}/leaderboard`}
                          className="btn btn-outline px-4 py-3 rounded-xl transition-all duration-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 font-semibold"
                          title="লিডারবোর্ড দেখুন"
                        >
                          <FaTrophy className="text-lg" />
                          <span className="hidden sm:inline">লিডারবোর্ড</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizList;
