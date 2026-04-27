import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCalendar,
  FaClock,
  FaFire,
  FaLock,
  FaQuestionCircle,
  FaTrophy,
} from "react-icons/fa";
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
      toast.error("Please login to start the quiz");
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

  const getDifficultyLevel = (questionsCount) => {
    if (questionsCount <= 5)
      return { level: "Beginner", color: "text-green-600" };
    if (questionsCount <= 10)
      return { level: "Intermediate", color: "text-blue-600" };
    return { level: "Advanced", color: "text-purple-600" };
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <MdQuiz className="text-4xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">কুইজ</h1>
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
                  <span>Login required to start quizzes</span>
                  <Link
                    to="/login"
                    className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    Login Now
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notice Marquee */}
      <NoticeMarquee displayLocation="quiz" />

      <div className="container mx-auto px-4 py-12">
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
            {/* Filter/Info Bar */}
            <div className="mb-8 flex flex-wrap gap-3 items-center">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2">
                <FaFire className="text-green-600" />
                {
                  quizzes.filter(
                    (q) => getQuizStatusBangladesh(q).text === "Active",
                  ).length
                }{" "}
                এক্টিভ
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold flex items-center gap-2">
                <FaClock className="text-blue-600" />
                {
                  quizzes.filter(
                    (q) => getQuizStatusBangladesh(q).text === "Upcoming",
                  ).length
                }{" "}
                আসন্ন
              </div>
            </div>

            {/* Quizzes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes?.map((quiz) => {
                const status = getQuizStatus(quiz);
                const difficulty = getDifficultyLevel(quiz.questions?.length);
                const startTime = formatTime(quiz.startDate);
                const endTime = formatTime(quiz.endDate);
                const startDate = formatDate(quiz.startDate);
                const endDate = formatDate(quiz.endDate);
                // const subtitle = quiz(quiz.subtitle);

                return (
                  <div
                    key={quiz._id}
                    className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Card Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                    {/* Card Container */}
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-purple-200 transition-colors">
                      {/* Status Bar */}
                      <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                      {/* Header Section */}
                      <div className="p-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`badge ${getStatusBadgeStyle(status)} font-semibold gap-1.5`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                            {status.text}
                          </div>
                          <div
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${difficulty.color} bg-opacity-10 bg-current`}
                          >
                            {difficulty.level}
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {quiz.title}
                        </h2>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-4">
                        {/* Description */}
                        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                          {quiz.description ||
                            "Challenge yourself with this exciting quiz!"}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-indigo-50 rounded-lg text-center">
                            <FaQuestionCircle className="text-indigo-600 mx-auto mb-1 text-lg" />
                            <p className="text-xs text-gray-600">Questions</p>
                            <p className="font-bold text-gray-800">
                              {quiz.questions?.length || 0}
                            </p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg text-center">
                            <FaClock className="text-purple-600 mx-auto mb-1 text-lg" />
                            <p className="text-xs text-gray-600">Duration</p>
                            <p className="font-bold text-gray-800">
                              {quiz.timeLimit} mins
                            </p>
                          </div>
                        </div>

                        {/* Timing Information */}
                        {quiz.startDate && quiz.endDate && (
                          <div className="space-y-2 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <FaCalendar className="text-amber-600 flex-shrink-0" />
                              <span>
                                <strong>Starts:</strong> {startDate} at{" "}
                                <span className="font-semibold text-amber-700">
                                  {startTime}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <FaClock className="text-orange-600 flex-shrink-0" />
                              <span>
                                <strong>Ends:</strong> {endDate} at{" "}
                                <span className="font-semibold text-orange-700">
                                  {endTime}
                                </span>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Status-specific Message */}
                        {status.text === "Active" && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-800">
                            <FaFire className="text-green-600" />
                            <span>
                              This quiz is <strong>live now!</strong> Limited
                              time only.
                            </span>
                          </div>
                        )}

                        {status.text === "Upcoming" && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                            <p>Get ready! This quiz starts soon.</p>
                          </div>
                        )}

                        {status.text === "Ended" && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                            <p>
                              This quiz has ended. Check the leaderboard to see
                              results!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
                        {status.text === "Active" ? (
                          <>
                            {user ? (
                              <button
                                onClick={() => handleStartQuiz(quiz._id)}
                                className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/50 hover:scale-[1.02] active:scale-[0.98]"
                              >
                                🚀 Start Quiz
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  toast.error("Please login to start the quiz");
                                  navigate("/login");
                                }}
                                className="flex-1 btn bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                              >
                                <FaLock className="text-lg" />
                                <span>Login to Start</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            className="flex-1 btn btn-disabled py-3 rounded-xl"
                            disabled
                          >
                            {status.text === "Ended"
                              ? "❌ Quiz Ended"
                              : "🔒 Coming Soon"}
                          </button>
                        )}
                        <Link
                          to={`/quiz/${quiz._id}/leaderboard`}
                          className="btn btn-outline btn-accent px-4 py-3 rounded-xl transition-all duration-300 hover:bg-accent hover:text-white"
                          title="View Leaderboard"
                        >
                          <FaTrophy className="text-lg" />
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
