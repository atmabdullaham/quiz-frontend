import { FaTimes } from "react-icons/fa";
import {
  classToBengali,
  englishToBengaliNumerals,
} from "../utils/bengaliTranslations";

const DetailedResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const publishTypeLabel = {
    classwise: "শ্রেণী অনুযায়ী",
    overall: "সর্বোচ্চ স্কোর",
  };

  // Extract winners from both group-wise and legacy formats
  let winners = [];
  if (result.results && typeof result.results === "object") {
    // Group-wise format
    for (const groupData of Object.values(result.results)) {
      if (groupData.topWinners && Array.isArray(groupData.topWinners)) {
        winners.push(...groupData.topWinners);
      }
    }
  } else if (result.topWinners && Array.isArray(result.topWinners)) {
    // Legacy format
    winners = result.topWinners;
  } else if (Array.isArray(result.winners)) {
    // Fallback
    winners = result.winners;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-6 py-6 text-white md:px-8">
          <div className="absolute -top-16 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur">
                ফলাফল বিস্তারিত
              </span>
              <div>
                <h2 className="text-3xl font-black md:text-4xl">
                  {result.quizId?.title || "অজানা কুইজ"}
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-blue-100 md:text-base">
                  বিজয়ীদের সম্পূর্ণ তথ্য এক নজরে দেখুন।
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-circle border-0 bg-white/15 text-white shadow-lg hover:bg-white/25"
              aria-label="বন্ধ করুন"
            >
              <FaTimes />
            </button>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg">
              <p className="text-sm text-blue-100">প্রকাশিত তারিখ</p>
              <p className="mt-2 text-base font-semibold text-white">
                {new Date(result.publishedAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg">
              <p className="text-sm text-blue-100">ফলাফল ধরন</p>
              <p className="mt-2 text-base font-semibold text-white">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${result.publishType === "classwise" ? "bg-white/15 text-white" : "bg-emerald-400/20 text-emerald-50"}`}
                >
                  {publishTypeLabel[result.publishType]}
                </span>
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg">
              <p className="text-sm text-blue-100">মোট বিজয়ী</p>
              <p className="mt-2 text-base font-semibold text-white">
                {winners.length} জন
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[72vh] space-y-6 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  বিজয়ী শিক্ষার্থীরা
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  নিচে প্রতিটি বিজয়ীর প্রয়োজনীয় তথ্য দেখানো হয়েছে।
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                {winners.length} জন তালিকাভুক্ত
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm font-bold text-slate-700">
                    <th className="px-4 py-4">র‍্যাঙ্ক</th>
                    <th className="px-4 py-4">নাম</th>
                    <th className="px-4 py-4">প্রতিষ্ঠান</th>
                    <th className="px-4 py-4">ক্লাস</th>
                    <th className="px-4 py-4">রোল</th>
                    <th className="px-4 py-4">মোবাইল নম্বর</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.length > 0 ? (
                    winners.map((winner, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-4 align-top">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-black text-white shadow-md">
                            {winner.position || idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-sm font-semibold text-slate-900">
                          {winner.studentName || "—"}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-slate-600">
                          {winner.schoolName || "—"}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-slate-600">
                          {classToBengali(winner.className) || "—"}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-slate-600">
                          {englishToBengaliNumerals(
                            winner.roll || winner.rollNumber,
                          ) || "—"}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-slate-600">
                          {winner.phoneNumber || winner.mobileNumber || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-12 text-center text-slate-500"
                      >
                        কোনো বিজয়ী নেই
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 md:px-8">
          <button
            onClick={onClose}
            className="btn btn-primary rounded-full px-6"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedResultModal;
