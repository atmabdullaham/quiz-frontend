import { useEffect, useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaMedal, FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
import NoticeMarquee from "../components/NoticeMarquee";
import axios from "../utils/axios";

// Group configuration - same as PublishResultModal
const GROUP_CONFIG = {
  স্বপ্নিল: {
    name: "১ম গ্রুপ - স্বপ্নিল (৪র্থ-৭ম শ্রেণি)",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  প্রত্যয়: {
    name: "২য় গ্রুপ - প্রত্যয় (৮ম-১০ম শ্রেণি)",
    color: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-900",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
  অগ্রপথিক: {
    name: "৩য় গ্রুপ - অগ্রপথিক (১১শ-১২শ)",
    color: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-900",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
  },
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchResults();

    // Auto-refetch when window regains focus (user switches back to tab)
    const handleFocus = () => {
      fetchResults();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchResults = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await axios.get("/api/published-results");

      console.log("Published results response:", response.data); // Debug log

      // Map the response data to ensure compatibility with frontend
      const mappedResults = Array.isArray(response.data)
        ? response.data.map((result) => ({
            ...result,
            // For group-wise results, results object is already present
            results: result.results || undefined,
            // Normalize winners: use topWinners if winners doesn't exist
            winners: result.winners || result.topWinners || [],
            // Ensure quizId has default values
            quizId: result.quizId || { title: "অজানা কুইজ", _id: "unknown" },
          }))
        : [];

      console.log("Mapped results:", mappedResults); // Debug log
      setResults(mappedResults);
      setError("");
    } catch (err) {
      console.error("Error fetching results:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "ফলাফল লোড করতে ব্যর্থ হয়েছে";
      setError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchResults();
  };

  // Helper function to get winner info from different data structures
  const getWinnerInfo = (winner) => {
    return {
      studentName:
        winner?.studentName || winner?.userId?.profile?.studentName || "—",
      className:
        winner?.className || winner?.userId?.profile?.className || "শ্রেণী নেই",
      schoolName:
        winner?.schoolName ||
        winner?.userId?.profile?.schoolName ||
        "প্রতিষ্ঠান নেই",
    };
  };

  // Helper function to organize results by group (if available) or use flat list
  const getDisplayWinners = (result) => {
    // If result has group-wise data, return organized structure
    if (result.results && typeof result.results === "object") {
      return {
        isGroupwise: true,
        groups: result.results,
      };
    }
    // Otherwise use flat winners list
    return {
      isGroupwise: false,
      winners: result.winners || result.topWinners || [],
    };
  };

  const totalWinners = results.reduce((sum, result) => {
    if (result.results && typeof result.results === "object") {
      // Group-wise format: count all winners from all groups
      return (
        sum +
        Object.values(result.results).reduce((groupSum, group) => {
          return groupSum + (group.topWinners?.length || 0);
        }, 0)
      );
    } else {
      // Flat format: count from topWinners or winners
      return sum + (result.winners?.length || result.topWinners?.length || 0);
    }
  }, 0);

  const latestPublishedAt = results.length
    ? results
        .map((result) => new Date(result.publishedAt))
        .sort((a, b) => b - a)[0]
    : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 text-white">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl shadow-lg shadow-blue-950/20">
                  <FaMedal />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    ফলাফল
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/25 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
                title="ফলাফল রিফ্রেশ করুন"
              >
                <FaSync className={refreshing ? "animate-spin" : ""} />
              </button>

              <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-2xl shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
                <div className="rounded-[1.75rem] bg-white p-6 text-slate-900 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                      <FaMedal className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                        Result Board
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NoticeMarquee displayLocation="result" />

      <div className="container mx-auto md:px-4  py-4 md:py-16">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-6 shadow-lg">
            <div className="alert alert-error rounded-2xl">
              <span>{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="btn btn-primary mt-4 gap-2"
            >
              {refreshing && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-100 to-indigo-100 text-4xl text-blue-700">
              <FaMedal />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              এখনো কোন ফলাফল প্রকাশিত হয়নি
            </p>
            <p className="mt-3 text-slate-500">
              ফলাফল প্রকাশ হলে তা এখানে সবচেয়ে সুন্দর কার্ড লেআউটে দেখানো হবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((result) => {
              const displayData = getDisplayWinners(result);

              return (
                <Link
                  key={result._id}
                  to={`/published-result/${result.quizId?._id}`}
                  className="group"
                >
                  <article className="relative overflow-hidden md:rounded-2xl border border-slate-200 bg-white transition-all duration-300 ">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <div className="p-4 md:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <FaCalendarAlt />
                            {new Date(result.publishedAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>

                          <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900 group-hover:text-blue-700">
                            {result.quizId?.title || "অজানা কুইজ"}
                          </h3>
                        </div>

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                          <FaMedal className="text-2xl" />
                        </div>
                      </div>

                      {/* Display Group-wise Results */}
                      {displayData.isGroupwise ? (
                        <div className="mt-6 space-y-6">
                          {Object.entries(displayData.groups).map(
                            ([groupKey, groupData]) => {
                              const config = GROUP_CONFIG[groupKey];
                              const winners = groupData.topWinners || [];

                              // Skip empty groups
                              if (winners.length === 0) return null;

                              return (
                                <div key={groupKey} className="overflow-x-auto">
                                  <div className={`p-3 mb-2 rounded-t-xl border-2 ${config?.borderColor} ${config?.color}`}>
                                    <p className={`text-sm font-bold ${config?.textColor}`}>
                                      {config?.name || groupKey}
                                    </p>
                                  </div>
                                  <table className="min-w-full divide-y-2 divide-gray-200 border-2 border-t-0 rounded-b-xl overflow-hidden">
                                    <thead className="ltr:text-left rtl:text-right bg-slate-50">
                                      <tr className="*:font-semibold *:text-gray-700 *:text-sm">
                                        <th className="px-4 py-3 whitespace-nowrap">অবস্থান</th>
                                        <th className="px-4 py-3 whitespace-nowrap">শিক্ষার্থীর নাম</th>
                                        <th className="px-4 py-3 whitespace-nowrap">স্কোর</th>
                                        <th className="px-4 py-3 whitespace-nowrap">শ্রেণি</th>
                                        <th className="px-4 py-3 whitespace-nowrap">প্রতিষ্ঠান</th>
                                      </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
                                      {winners.map((winner, idx) => {
                                        const winnerInfo = getWinnerInfo(winner);
                                        const medals = ["🥇", "🥈", "🥉"];
                                        return (
                                          <tr
                                            key={idx}
                                            className="*:text-gray-900 *:text-sm hover:bg-blue-50 transition-colors"
                                          >
                                            <td className="px-4 py-3 whitespace-nowrap font-semibold text-lg text-center">
                                              {medals[idx] || `#${idx + 1}`}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-semibold">
                                              {winnerInfo.studentName}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-bold text-blue-600">
                                              {winner.score || "—"}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                              {winnerInfo.className}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                                              {winnerInfo.schoolName}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        /* Display Flat Winners List (Backward Compatibility) */
                        <>
                          <div className="mt-6 flex flex-wrap gap-3">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                              {result.publishType === "classwise"
                                ? "শ্রেণী অনুযায়ী"
                                : "সর্বোচ্চ স্কোর"}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                              {displayData.winners?.length || 0} জন বিজয়ী
                            </span>
                          </div>

                          <div className="mt-6 space-y-3">
                            {displayData.winners
                              .slice(0, 3)
                              .map((winner, idx) => {
                                const winnerInfo = getWinnerInfo(winner);
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                                  >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm ring-1 ring-slate-200">
                                      {idx === 0 && "🥇"}
                                      {idx === 1 && "🥈"}
                                      {idx === 2 && "🥉"}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate font-semibold text-slate-900">
                                        {winnerInfo.studentName}
                                      </p>
                                      <p className="truncate text-xs text-slate-500">
                                        {winnerInfo.className} •{" "}
                                        {winnerInfo.schoolName}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </>
                      )}

                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                        সম্পূর্ণ ফলাফল দেখুন
                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
