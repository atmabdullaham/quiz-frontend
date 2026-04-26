import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaDownload,
  FaMedal,
  FaShare,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import axios from "../utils/axios";
import { downloadPNG } from "../utils/downloadUtils";

const PublishedResult = () => {
  const { quizId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const resultCardRef = useRef(null);

  useEffect(() => {
    fetchResult();
  }, [quizId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/published-results/${quizId}`);
      setResult(response.data);
      setError("");
    } catch (err) {
      setError("ফলাফল পাওয়া যায়নি");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = async () => {
    if (!resultCardRef.current) return;

    try {
      setDownloading(true);
      const fileName = `${(result?.quizId?.title || "result").replace(/\s+/g, "_")}_ফলাফল_${new Date().toLocaleDateString("bn-BD")}.png`;
      await downloadPNG(resultCardRef.current, fileName);
      toast.success("ফলাফল PNG হিসেবে ডাউনলোড হয়েছে ✓");
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error message:", err?.message);
      console.error("Error stack:", err?.stack);

      const errorMsg = err?.message || err?.toString() || "অজানা ত্রুটি";

      if (errorMsg.includes("html2canvas")) {
        toast.error("⚠️ html2canvas ইনস্টল করুন: npm install html2canvas");
      } else if (
        errorMsg.includes("oklch") ||
        errorMsg.includes("color function")
      ) {
        toast.error(
          "⚠️ CSS রেন্ডারিং সমস্যা। দয়া করে পুনরায় চেষ্টা করুন অথবা পেজ রিফ্রেশ করুন।",
        );
      } else if (errorMsg.includes("Attempting to parse")) {
        toast.error("⚠️ CSS পার্সিং সমস্যা। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।");
      } else {
        toast.error("❌ ডাউনলোড ব্যর্থ: " + errorMsg.substring(0, 60));
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#ffffff_50%,#f8fafc_100%)]">
        <div className="container mx-auto px-4 py-16">
          <Link to="/results" className="btn btn-ghost mb-8 gap-2 rounded-full">
            <FaArrowLeft />
            ফলাফলে ফিরুন
          </Link>
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-rose-200 bg-white p-6 shadow-xl">
            <div className="alert alert-error rounded-2xl">
              <span>{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const winners = Array.isArray(result.winners) ? result.winners : [];
  const groupedWinners = winners.reduce((grouped, winner) => {
    const key = winner.className || "সাধারণ";
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(winner);
    return grouped;
  }, {});

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-cyan-200/10 blur-3xl" />

        <div className="container mx-auto px-4 py-8 md:py-10 relative">
          <Link
            to="/results"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur transition hover:bg-white/20 hover:text-white"
          >
            <FaArrowLeft /> ফলাফলে ফিরুন
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur">
                প্রকাশিত ফলাফল
              </span>

              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl shadow-lg shadow-slate-950/20">
                  <FaMedal />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    {result.quizId?.title || "ফলাফল"}
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm md:text-lg leading-relaxed text-blue-100">
                    {result.publishType === "classwise"
                      ? "শ্রেণী অনুযায়ী বিজয়ীদের পরিষ্কার, মর্যাদাপূর্ণ উপস্থাপনা।"
                      : "সামগ্রিক বিজয়ীদের পরিপাটি ও উচ্চমানের উপস্থাপনা।"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold backdrop-blur">
                  <FaCalendarAlt />
                  {new Date(result.publishedAt).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold backdrop-blur">
                  {result.publishType === "classwise"
                    ? "শ্রেণী অনুযায়ী ফলাফল"
                    : "সর্বোচ্চ স্কোর ফলাফল"}
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-2xl shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleDownloadPNG}
                  disabled={downloading}
                  className="btn border-0 bg-white text-blue-700 hover:bg-blue-50 gap-2 rounded-2xl shadow-lg"
                >
                  <FaDownload />
                  {downloading ? "ডাউনলোড হচ্ছে..." : "PNG ডাউনলোড"}
                </button>
                <button
                  onClick={handleShare}
                  className={`btn gap-2 rounded-2xl border border-white/15 ${copied ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  <FaShare />
                  {copied ? "অনুলিপি হয়েছে" : "শেয়ার করুন"}
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">প্রকাশের দিন</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {new Date(result.publishedAt).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">ফলাফল ধরন</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {result.publishType === "classwise"
                      ? "শ্রেণী অনুযায়ী"
                      : "সর্বোচ্চ স্কোর"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">মোট বিজয়ী</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {winners.length} জন
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {result.publishType === "classwise" ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {Object.entries(groupedWinners).map(([className, classWinners]) => (
              <section
                key={className}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
              >
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
                        শ্রেণী
                      </p>
                      <h2 className="mt-1 text-2xl font-black">{className}</h2>
                    </div>
                    <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                      {classWinners.length} জন
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5 md:p-6">
                  {classWinners.map((winner, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-lg">
                        {idx === 0 && "🥇"}
                        {idx === 1 && "🥈"}
                        {idx === 2 && "🥉"}
                        {idx > 2 && (
                          <span className="text-sm font-black text-white">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-black text-slate-900">
                          {winner.studentName || "—"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                            {winner.schoolName || "প্রতিষ্ঠান নেই"}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                            {winner.className || "শ্রেণী নেই"}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                            রোল {winner.rollNumber || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-7">
              <h2 className="text-2xl font-black text-slate-900">
                শীর্ষ বিজয়ীরা
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                র‍্যাঙ্ক, নাম, প্রতিষ্ঠান, শ্রেণী এবং রোল অনুযায়ী তালিকা।
              </p>
            </div>

            <div className="space-y-3 p-5 md:p-6">
              {winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-lg">
                    {idx === 0 && "🥇"}
                    {idx === 1 && "🥈"}
                    {idx === 2 && "🥉"}
                    {idx > 2 && (
                      <span className="text-sm font-black text-white">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black text-slate-900">
                      {winner.studentName || "—"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                        {winner.schoolName || "প্রতিষ্ঠান নেই"}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                        {winner.className || "শ্রেণী নেই"}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                        রোল {winner.rollNumber || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div style={{ position: "fixed", left: "-9999px", top: "-9999px" }}>
        <ResultCard
          result={result}
          quizTitle={result.quizId?.title || "ফলাফল"}
          quizSubtitle={result.quizId?.subtitle || ""}
          forRef={resultCardRef}
        />
      </div>
    </div>
  );
};

export default PublishedResult;
