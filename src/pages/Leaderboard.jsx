import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaChartBar,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

const Leaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: userSubmission, isLoading } = useQuery({
    queryKey: ["user-submission", id, user?.email || "public"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/quizzes/${id}/my-submission`);
      return data;
    },
  });

  const { data: quiz } = useQuery({
    queryKey: ["quiz-info", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/quizzes/${id}`);
      return data;
    },
    retry: false,
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-white">Loading your results...</p>
        </div>
      </div>
    );
  }

  // Show user's result options
  if (userSubmission) {
    const scorePercentage =
      userSubmission?.score && userSubmission?.totalQuestions
        ? (
            (userSubmission.score / userSubmission.totalQuestions) *
            100
          ).toFixed(1)
        : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 md:py-8">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-indigo-200 transition mb-4 text-sm md:text-base"
            >
              <FaArrowLeft /> ফিরে যান
            </button>
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {quiz?.title}
              </h1>
              <p className="text-sm md:text-lg text-white/90">আপনার ফলাফল</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl flex flex-col justify-center">
          {/* Score Display Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-white text-lg md:text-xl opacity-90 mb-4">
                আপনার মোট স্কোর
              </h2>
              <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl p-8 md:p-12 inline-block mx-auto">
                <div className="text-5xl md:text-7xl font-bold text-white font-mono">
                  {userSubmission?.score || 0}
                </div>
                <div className="text-xl md:text-2xl text-white/90 mt-2 font-semibold">
                  মোট {userSubmission?.totalQuestions || 0} এর মধ্যে
                </div>
                <div className="text-2xl md:text-4xl text-white font-bold mt-4">
                  {scorePercentage}%
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-white/70 text-sm md:text-base mb-2">
                  ⏱️ সময় নিয়েছেন
                </p>
                <p className="text-white text-2xl md:text-3xl font-bold">
                  {formatTime(userSubmission?.timeTaken || 0)}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-white/70 text-sm md:text-base mb-2">
                  ✓ সঠিক উত্তর
                </p>
                <p className="text-white text-2xl md:text-3xl font-bold">
                  {userSubmission?.score || 0} টি
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Your Result Button */}
            <Link to={`/quiz/${id}/result`} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 group-active:opacity-50"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition duration-300 text-center cursor-pointer group-active:scale-95">
                <FaChartBar className="text-3xl md:text-4xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  আপনার ফলাফল
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  বিস্তারিত দেখতে ক্লিক করুন
                </p>
              </div>
            </Link>

            {/* Result Button */}
            <Link to={`/quiz/${id}/result`} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 group-active:opacity-50"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition duration-300 text-center cursor-pointer group-active:scale-95">
                <FaChartBar className="text-3xl md:text-4xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  ফলাফল পৃষ্ঠা
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  বিশদ বিবরণ দেখুন
                </p>
              </div>
            </Link>
          </div>

          {/* Answer Review Section */}
          <div id="answer-review" className="mt-12">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <FaCheckCircle className="text-blue-400" /> উত্তর পর্যালোচনা
              </h2>

              <div className="space-y-4">
                {userSubmission?.answers?.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                          প্রশ্ন {index + 1}: {answer.questionText}
                        </h3>
                        {answer.isCorrect ? (
                          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm font-semibold border border-green-500/50">
                            <FaCheckCircle /> সঠিক
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold border border-red-500/50">
                            <FaTimes /> ভুল
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-sm text-blue-300 mb-2">
                          আপনার উত্তর
                        </p>
                        <p className="font-semibold text-white text-base md:text-lg">
                          {answer.selectedOption || "উত্তর দেওয়া হয়নি"}
                        </p>
                      </div>
                      {!answer.isCorrect && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <p className="text-sm text-green-300 mb-2">
                            ✓ সঠিক উত্তর
                          </p>
                          <p className="font-semibold text-green-200 text-base md:text-lg">
                            {answer.correctOption}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 gap-4 flex flex-col md:flex-row justify-center">
            <Link
              to="/quizzes"
              className="btn btn-lg bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              আরও কুইজ দেখুন
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-lg btn-outline border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-3xl font-bold text-white mb-4">কোন ফলাফল নেই</h1>
        <p className="text-white/80 mb-8">
          এই কুইজে আপনার কোনো জমা দেওয়া ফলাফল নেই।
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/quizzes" className="btn btn-primary btn-lg">
            কুইজ তালিকায় যান
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-lg text-white border-white hover:bg-white/10"
          >
            ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
