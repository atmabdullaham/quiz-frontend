import { useEffect, useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaMedal } from "react-icons/fa";
import { Link } from "react-router-dom";
import NoticeMarquee from "../components/NoticeMarquee";
import axios from "../utils/axios";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/published-results");
      setResults(Array.isArray(response.data) ? response.data : []);
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
    }
  };

  const totalWinners = results.reduce(
    (sum, result) => sum + (result.winners?.length || 0),
    0,
  );

  const latestPublishedAt = results.length
    ? results
        .map((result) => new Date(result.publishedAt))
        .sort((a, b) => b - a)[0]
    : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
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

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg shadow-lg shadow-blue-950/20">
                  <p className="text-sm text-blue-100">প্রকাশিত ফলাফল</p>
                  <p className="mt-2 text-3xl font-black">{results.length}</p>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg shadow-lg shadow-blue-950/20">
                  <p className="text-sm text-blue-100">মোট বিজয়ী</p>
                  <p className="mt-2 text-3xl font-black">{totalWinners}</p>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg shadow-lg shadow-blue-950/20">
                  <p className="text-sm text-blue-100">সর্বশেষ প্রকাশ</p>
                  <p className="mt-2 text-base font-semibold">
                    {latestPublishedAt
                      ? latestPublishedAt.toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
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

      <div className="container mx-auto px-4 py-12 md:py-16">
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
              onClick={fetchResults}
              className="btn btn-primary mt-4 gap-2"
            >
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
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {results.map((result) => (
              <Link
                key={result._id}
                to={`/published-result/${result.quizId?._id}`}
                className="group"
              >
                <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                  <div className="p-6 md:p-7">
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
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                          প্রকাশিত ফলাফল দেখুন, র‍্যাঙ্কিং তুলনা করুন এবং
                          বিস্তারিত পৃষ্ঠায় যান।
                        </p>
                      </div>

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                        <FaMedal className="text-2xl" />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                        {result.publishType === "classwise"
                          ? "শ্রেণী অনুযায়ী"
                          : "সর্বোচ্চ স্কোর"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        {result.winners?.length || 0} জন বিজয়ী
                      </span>
                    </div>

                    <div className="mt-6 space-y-3">
                      {(result.winners || []).slice(0, 3).map((winner, idx) => (
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
                              {winner.studentName || "—"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {winner.className || "শ্রেণী নেই"} •{" "}
                              {winner.schoolName || "প্রতিষ্ঠান নেই"}
                            </p>
                          </div>
                          <div className="text-xs font-medium text-slate-400">
                            র‍্যাঙ্ক
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                      সম্পূর্ণ ফলাফল দেখুন
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
