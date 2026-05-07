import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/logo3.jpg";
import axios from "../utils/axios";
import {
  classToBengali,
  englishToBengaliNumerals,
} from "../utils/bengaliTranslations";
import { downloadPNG } from "../utils/downloadUtils";

// Group configuration with proper names
const GROUP_CONFIG = {
  স্বপ্নিল: {
    name: "স্বপ্নিল (৪র্থ-৭ম শ্রেণি)",
  },
  প্রত্যয়: {
    name: "প্রত্যয় (৮ম-১০ম শ্রেণি)",
  },
  অগ্রপথিক: {
    name: "অগ্রপথিক (১১শ-১২শ)",
  },
};

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
      console.error("Download error:", err);

      const errorMsg = err?.message || err?.toString() || "অজানা ত্রুটি";

      if (errorMsg.includes("html-to-image")) {
        toast.error("⚠️ npm install html-to-image করুন");
      } else if (
        errorMsg.includes("CORS") ||
        errorMsg.includes("cross-origin")
      ) {
        toast.error("⚠️ ছবি লোড করতে সমস্যা। দয়া করে পুনরায় চেষ্টা করুন।");
      } else {
        toast.error("❌ ডাউনলোড ব্যর্থ: " + errorMsg.substring(0, 50));
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
    <div className="max-w-3xl mx-auto bg-[radial-gradient(circle_at_top,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="container mx-auto md:px-4 md:py-4">
        <section
          ref={resultCardRef}
          className="md:rounded-2xl border-2 border-slate-300 bg-white"
          style={{
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Card Header */}
          <div className="bg-purple-100 border-b-2 border-slate-300  p-4 md:p-8 md:rounded-t-2xl">
            <div className="space-y-2 md:space-y-3 text-center">
              <h1 className="text-xl text-center font-normal md:font-medium text-slate-900 md:text-4xl tiro">
                {result.quizId?.title || "ফলাফল"}
              </h1>
              {result.quizId?.subtitle && (
                <p className="text-lg text-slate-600">
                  {result.quizId.subtitle}
                </p>
              )}

              <h3 className="inline-block  text-sm font-bold text-indigo-600 text-center border ">
                ফলাফল
              </h3>

              {/* <p className="text-center text-sm font-semibold text-slate-700">
                প্রকাশ করা হয়েছে{" "}
                {new Date(result.publishedAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p> */}
            </div>
          </div>

          {/* Card Body */}
          <div className=" ">
            {/* Result Label */}

            {/* Group-wise Results */}
            <div className="">
              {groupedWinners.map((group) => (
                <div
                  key={group.groupName}
                  className="bg-green-200 py-1 md:py-2  px-2 md:px-8 border-b border-slate-300"
                >
                  {/* Group Header with Class */}
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-xs md:text-lg font-normal md:font-medium text-slate-900 noto">
                      {GROUP_CONFIG[group.groupName]?.name || group.groupName}
                    </h3>
                    {/* <span
                      className="px-3 py-1 text-xs font-semibold text-white rounded-full"
                      style={{
                        backgroundColor: "#64748b",
                      }}
                    >
                      {englishToBengaliNumerals(group.winners.length)} জন
                    </span> */}
                  </div>

                  {/* Winners List */}
                  <ul className="space-y-1">
                    {group.winners.map((winner, idx) => (
                      <li
                        key={`${group.groupName}-${idx}`}
                        className="flex items-center rounded-lg border-slate-300"
                      >
                        {/* Rank Badge */}
                        <div
                          className="flex p-1  items-center justify-center rounded-full text-sm font-white text-purple-700 noto bg-purple-200 mr-1"
                          // style={{
                          //   backgroundColor:
                          //     idx === 0
                          //       ? "#f59e0b"
                          //       : idx === 1
                          //         ? "#f97316"
                          //         : idx === 2
                          //           ? "#ea580c"
                          //           : "#d97706",
                          // }}
                        >
                          {idx === 0
                            ? "১ম"
                            : idx === 1
                              ? "২য়"
                              : idx === 2
                                ? "৩য়"
                                : englishToBengaliNumerals(idx + 1)}
                        </div>

                        {/* Winner Info */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full ">
                          <div className="text-sm text-slate-900 tiro ">
                            {winner.studentName || "—"}
                          </div>
                          <div className="text-xs font-semibold text-slate-600 noto">
                            {winner.schoolName || "প্রতিষ্ঠান নেই"}
                          </div>
                          <div className="flex gap-2">
                            <div className="text-xs font-semibold text-slate-600 noto">
                              {classToBengali(winner.className) || "শ্রেণী নেই"}
                            </div>
                            <div className="text-xs font-semibold text-slate-600 noto">
                              রোল{" "}
                              {englishToBengaliNumerals(winner.rollNumber) ||
                                "—"}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center py-2 bg-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full">
                <img
                  className="rounded-full overflow-hidden"
                  src={logo}
                  alt=""
                />
              </div>
              <div className="flex flex-col  text-center tiro">
                <h2 className="noto">কিশোরকণ্ঠ পাঠক ফোরাম</h2>
                <h3 className="noto">চট্টগ্রাম মহানগর উত্তর</h3>
              </div>
            </div>
          </div>

          {/* Card Footer - Action Buttons */}
        </section>
      </div>
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
    </div>
  );
};

export default PublishedResult;
