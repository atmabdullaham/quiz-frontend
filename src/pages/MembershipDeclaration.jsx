import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

const MembershipDeclaration = () => {
  const navigate = useNavigate();
  const { dbUser, loading: authLoading, authCheckComplete } = useAuth();

  const [hasAccepted, setHasAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation for applying membership
  const applyMembership = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/membership/apply");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "আবেদন জমা করতে ব্যর্থ হয়েছে";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasAccepted) {
      toast.error("ঘোষণা গ্রহণ করা আবশ্যক");
      return;
    }

    setIsSubmitting(true);
    applyMembership.mutate();
    setIsSubmitting(false);
  };

  // Redirect if not authenticated
  if (!authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!dbUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 md:py-8">
      <div className="container mx-auto md:px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 md:p-10 shadow-2xl relative overflow-hidden border border-indigo-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/" className="hover:bg-white/10 p-2 rounded-lg">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">সদস্যপদ ঘোষণা</h1>
            </div>
            <p className="text-indigo-100 text-sm md:text-base">
              সদস্যপদ গ্রহণের আগে এই ঘোষণা পড়ুন এবং গ্রহণ করুন
            </p>
          </div>
        </div>

        {/* Declaration Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-200 px-6 md:px-10 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                2
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  সদস্যপদ ঘোষণা ও শর্তাবলী
                </h2>
                <p className="text-slate-600 text-xs md:text-sm mt-0.5">
                  দয়া করে নিচের ঘোষণা পড়ুন
                </p>
              </div>
            </div>
          </div>

          {/* Declaration Content */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Declaration Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                কিশোরকণ্ঠ পাঠক ফোরাম - সদস্যপদ ঘোষণা
              </h3>

              <div className="prose prose-sm max-w-none text-gray-700 space-y-3 text-justify">
                <p className="text-base leading-relaxed">
                  আমরা, কিশোরকণ্ঠ পাঠক ফোরাম চট্টগ্রাম মহানগর উত্তর এর পক্ষে এই
                  ঘোষণা করছি যে সদস্যপদ প্রক্রিয়াটি শিক্ষার্থীদের মেধা ও মননের
                  বিকাশ, দেশপ্রেম ও চারিত্রিক মূল্যবোধ সৃষ্টির লক্ষ্যে পরিচালিত
                  হয়।
                </p>

                <p className="text-base leading-relaxed">
                  <strong>সদস্যদের দায়িত্ব ও কর্তব্য:</strong>
                </p>

                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>সকল কার্যক্রমে সৎ ও নিষ্ঠার সাথে অংশগ্রহণ করা</li>
                  <li>অন্যান্য সদস্যের প্রতি সম্মান ও শ্রদ্ধা বজায় রাখা</li>
                  <li>প্ল্যাটফর্মের নিয়ম কানুন মেনে চলা</li>
                  <li>কোনো প্রকার অনৈতিক কাজে জড়িত না হওয়া</li>
                  <li>
                    প্রদত্ত ব্যক্তিগত তথ্য সঠিক ও বাস্তব হওয়া নিশ্চিত করা
                  </li>
                </ul>

                <p className="text-base leading-relaxed">
                  <strong>সদস্যরা পাবেন:</strong>
                </p>

                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>বিশেষ কুইজ ও প্রতিযোগিতায় অংশগ্রহণের সুযোগ</li>
                  <li>শিক্ষা সামগ্রী এবং সংস্থানে বিশেষ প্রবেশাধিকার</li>
                  <li>সম্প্রদায়ের সাথে সংযোগ স্থাপনের সুযোগ</li>
                  <li>নিয়মিত আপডেট এবং ঘোষণা</li>
                </ul>

                <p className="text-base leading-relaxed mt-4">
                  আমরা যেকোনো সময় নিয়ম লঙ্ঘনকারী সদস্যদের সদস্যপদ বাতিল করার
                  অধিকার সংরক্ষণ করি। সদস্যপদ অনুমোদন প্রশাসকের বিবেচনার উপর
                  নির্ভর করে এবং প্রদত্ত তথ্য যাচাই করা হয়।
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                  <p className="text-sm text-amber-900">
                    <strong>গুরুত্বপূর্ণ:</strong> আপনি যে তথ্য প্রদান করছেন তা
                    সম্পূর্ণ সত্য এবং যাচাইকৃত। মিথ্যা তথ্য প্রদান করলে আপনার
                    সদস্যপদ স্থায়ীভাবে বাতিল হতে পারে।
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <input
                type="checkbox"
                id="accept-terms"
                checked={hasAccepted}
                onChange={(e) => setHasAccepted(e.target.checked)}
                className="checkbox checkbox-indigo mt-1"
              />
              <label htmlFor="accept-terms" className="cursor-pointer">
                <span className="text-sm md:text-base text-gray-700">
                  আমি উপরোক্ত ঘোষণা ও শর্তাবলী পড়েছি এবং সম্পূর্ণভাবে গ্রহণ
                  করছি। আমার প্রদত্ত সকল তথ্য সত্য এবং যাচাইকৃত।
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline flex-1 rounded-xl font-medium"
              >
                <FaArrowLeft />
                ফিরে যান
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !hasAccepted || isSubmitting || applyMembership.isPending
                }
                className="btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium flex-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || applyMembership.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    জমা হচ্ছে...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    আবেদন জমা করুন
                  </>
                )}
              </button>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 flex items-start gap-2">
                <span className="text-base mt-0.5">ℹ️</span>
                <span>
                  তোমার আবেদন পর্যালোচনা করা হবে। আপনি শীঘ্রই ফলাফল জানতে
                  পারবেন।
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDeclaration;
