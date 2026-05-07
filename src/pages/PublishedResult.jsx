import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios";
import {
  classToBengali,
  englishToBengaliNumerals,
} from "../utils/bengaliTranslations";
import { downloadPNG } from "../utils/downloadUtils";

const PublishedResult = () => {
  const { quizId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const resultCardRef = useRef(null);

  const fetchResult = useCallback(async () => {
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
  }, [quizId]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

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

  const extractWinners = (currentResult) => {
    if (!currentResult) return [];

    if (currentResult.results && typeof currentResult.results === "object") {
      return Object.values(currentResult.results).flatMap((groupData) => {
        if (Array.isArray(groupData.topWinners)) {
          return groupData.topWinners;
        }
        return [];
      });
    }

    if (Array.isArray(currentResult.topWinners)) {
      return currentResult.topWinners;
    }

    if (Array.isArray(currentResult.winners)) {
      return currentResult.winners;
    }

    return [];
  };

  const winners = extractWinners(result);
  const groupedWinners = (() => {
    if (result.results && typeof result.results === "object") {
      return Object.entries(result.results)
        .map(([groupName, groupData]) => ({
          groupName,
          winners: Array.isArray(groupData?.topWinners)
            ? groupData.topWinners
            : [],
        }))
        .filter((group) => group.winners.length > 0);
    }

    const classWiseGroups = winners.reduce((grouped, winner) => {
      const key = winner.className || "সাধারণ";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(winner);
      return grouped;
    }, {});

    return Object.entries(classWiseGroups).map(([groupName, groupWinners]) => ({
      groupName,
      winners: groupWinners,
    }));
  })();

  return (
    <div className="max-w-4xl mx-auto bg-[radial-gradient(circle_at_top,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="container mx-auto md:px-4  md:py-14">
        <section
          ref={resultCardRef}
          className=" md:rounded-2xl border-2 border-slate-300 bg-white p-4 md:p-8"
          style={{
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Card Header */}
          <div className=" border-b-2 border-slate-300 pb-6 md:pb-8">
            <div className="space-y-3">
              <h1 className="text-2xl text-center font-black text-slate-900 md:text-4xl">
                {result.quizId?.title || "ফলাফল"}
              </h1>
              {result.quizId?.subtitle && (
                <p className="text-lg text-slate-600">
                  {result.quizId.subtitle}
                </p>
              )}
              <p className="text-center text-sm font-semibold text-slate-700">
                প্রকাশ করা হয়েছে{" "}
                {new Date(result.publishedAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div className="py-8 md:py-10">
            {/* Result Label */}
            <div className="text-center mb-8">
              <span
                className="inline-block px-4 py-2 text-sm font-bold text-white rounded-lg"
                style={{
                  backgroundColor: "#2563eb",
                }}
              >
                ফলাফল
              </span>
            </div>

            {/* Group-wise Results */}
            <div className="space-y-8">
              {groupedWinners.map((group) => (
                <div key={group.groupName}>
                  {/* Group Header with Class */}
                  <div className="mb-4 flex items-center justify-between gap-4 border-b-2 border-slate-300 pb-3">
                    <h3 className="text-lg font-black text-slate-900">
                      {group.groupName}
                    </h3>
                    <span
                      className="px-3 py-1 text-xs font-semibold text-white rounded-full"
                      style={{
                        backgroundColor: "#64748b",
                      }}
                    >
                      {englishToBengaliNumerals(group.winners.length)} জন
                    </span>
                  </div>

                  {/* Winners List */}
                  <ul className="space-y-3">
                    {group.winners.map((winner, idx) => (
                      <li
                        key={`${group.groupName}-${idx}`}
                        className="flex items-center gap-4 rounded-lg border border-slate-300 p-4"
                        style={{
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        {/* Rank Badge */}
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white"
                          style={{
                            backgroundColor:
                              idx === 0
                                ? "#f59e0b"
                                : idx === 1
                                  ? "#f97316"
                                  : idx === 2
                                    ? "#ea580c"
                                    : "#d97706",
                          }}
                        >
                          {idx === 0
                            ? "🥇"
                            : idx === 1
                              ? "🥈"
                              : idx === 2
                                ? "🥉"
                                : englishToBengaliNumerals(idx + 1)}
                        </div>

                        {/* Winner Info */}
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">
                            {winner.studentName || "—"}
                          </div>
                          <div className="text-xs font-semibold text-slate-600">
                            {winner.schoolName || "প্রতিষ্ঠান নেই"} <br />{" "}
                            {classToBengali(winner.className) || "শ্রেণী নেই"} •
                            রোল{" "}
                            {englishToBengaliNumerals(winner.rollNumber) || "—"}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Card Footer - Action Buttons */}
          <div className="border-t-2 border-slate-300 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleDownloadPNG}
                disabled={downloading}
                className="px-6 py-2 font-semibold text-white rounded-lg"
                style={{
                  backgroundColor: "#2563eb",
                }}
              >
                {downloading ? "ডাউনলোড হচ্ছে..." : "ডাউনলোড করুন"}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-2 font-semibold rounded-lg"
                style={{
                  backgroundColor: copied ? "#16a34a" : "#cbd5e1",
                  color: copied ? "white" : "#1e293b",
                }}
              >
                {copied ? "কপি হয়েছে" : "শেয়ার করুন"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PublishedResult;
