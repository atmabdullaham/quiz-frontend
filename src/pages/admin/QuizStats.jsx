import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaChartLine, FaTrophy, FaUsers } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import {
  formatBangladeshiDateTime,
  formatTimeTaken,
} from "../../utils/bangladeshiDate";

const QuizStats = () => {
  const { id } = useParams();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["quiz-stats", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/quizzes/${id}/stats`);
      return data;
    },
  });

  const formatTime = (seconds) => {
    return formatTimeTaken(seconds, false); // Use Bangladeshi format utility
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/admin" className="btn btn-ghost text-white mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Quiz Statistics</h1>
          <p className="text-xl text-white/90">
            Detailed analytics and participant data
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <FaUsers className="text-5xl text-indigo-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalParticipants}
            </h3>
            <p className="text-gray-600">Total Participants</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FaChartLine className="text-5xl text-purple-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.averageScore.toFixed(1)}
            </h3>
            <p className="text-gray-600">Average Score</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FaTrophy className="text-5xl text-green-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.highestScore}
            </h3>
            <p className="text-gray-600">Highest Score</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FaTrophy className="text-5xl text-red-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.lowestScore}
            </h3>
            <p className="text-gray-600">Lowest Score</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <h2 className="text-2xl font-bold text-white">All Submissions</h2>
          </div>
          {stats.submissions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Participant</th>
                    <th>Phone</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Time Taken</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.submissions.map((submission, index) => {
                    const percentage = (
                      (submission.score / submission.totalQuestions) *
                      100
                    ).toFixed(1);
                    return (
                      <tr key={submission._id} className="hover">
                        <td>
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <FaTrophy className="text-yellow-400" />
                            )}
                            {index === 1 && (
                              <FaTrophy className="text-gray-400" />
                            )}
                            {index === 2 && (
                              <FaTrophy className="text-orange-600" />
                            )}
                            <span className="font-bold">#{index + 1}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-bold">
                              {submission.studentName}
                            </div>
                            <div className="text-sm opacity-50">
                              {submission.schoolName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {submission.className}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="font-medium text-gray-800">
                            {submission.mobileNumber || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="font-bold text-lg">
                            {submission.score}
                          </span>
                          <span className="text-gray-500">
                            /{submission.totalQuestions}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <progress
                              className="progress progress-primary w-20"
                              value={submission.score}
                              max={submission.totalQuestions}
                            ></progress>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                        </td>
                        <td>{formatTime(submission.timeTaken)}</td>
                        <td>
                          {formatBangladeshiDateTime(submission.submittedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Score Distribution */}
        {stats.submissions.length > 0 && (
          <div className="glass-card p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Score Distribution
            </h2>
            <div className="space-y-4">
              {[
                { range: "90-100%", min: 0.9, color: "bg-green-500" },
                { range: "80-89%", min: 0.8, color: "bg-blue-500" },
                { range: "70-79%", min: 0.7, color: "bg-yellow-500" },
                { range: "60-69%", min: 0.6, color: "bg-orange-500" },
                { range: "Below 60%", min: 0, color: "bg-red-500" },
              ].map((bracket) => {
                const maxPercentage = bracket.range.startsWith("Below")
                  ? 0.6
                  : (parseInt(bracket.range) + 10) / 100;
                const count = stats.submissions.filter((s) => {
                  const percent = s.score / s.totalQuestions;
                  return bracket.range.startsWith("Below")
                    ? percent < maxPercentage
                    : percent >= bracket.min && percent < maxPercentage;
                }).length;
                const percentage = (
                  (count / stats.submissions.length) *
                  100
                ).toFixed(1);

                return (
                  <div key={bracket.range}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        {bracket.range}
                      </span>
                      <span className="font-bold text-gray-800">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`${bracket.color} h-full flex items-center justify-center text-white font-semibold transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      >
                        {count > 0 && <span className="text-sm">{count}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizStats;
