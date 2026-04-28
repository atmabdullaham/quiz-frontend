import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPlay,
  FaTrophy,
} from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import {
  validateBangladeshiPhone,
  validateField,
} from "../utils/profileValidation";

const CLASS_OPTIONS = [
  { value: "4", label: "চতুর্থ শ্রেণি" },
  { value: "5", label: "পঞ্চম শ্রেণি" },
  { value: "6", label: "ষষ্ঠ শ্রেণি" },
  { value: "7", label: "সপ্তম শ্রেণি" },
  { value: "8", label: "অষ্টম শ্রেণি" },
  { value: "9", label: "নবম শ্রেণি" },
  { value: "10", label: "দশম শ্রেণি" },
  { value: "11", label: "একাদশ শ্রেণি" },
  { value: "12", label: "দ্বাদশ শ্রেণি" },
];

const PreQuizForm = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authCheckComplete } = useAuth();

  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    schoolName: "",
    className: "",
    rollNumber: "",
    mobileNumber: "",
    address: "",
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    studentName: "",
    schoolName: "",
    className: "",
    rollNumber: "",
    mobileNumber: "",
    address: "",
  }); // Track original profile to detect changes

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [mobileForProfile, setMobileForProfile] = useState(""); // Track mobile for profile lookup

  // Check if already submitted (only for authenticated users)
  const {
    data: checkData,
    isLoading: checkingSubmission,
    error: checkError,
    refetch: refetchSubmissionCheck,
  } = useQuery({
    queryKey: ["check-submission", id, user?.email],
    queryFn: async () => {
      if (user) {
        // Authenticated user - check by user ID
        const { data } = await axios.get(`/api/quizzes/${id}/check-submission`);
        return data;
      }
      // Public user - skip the check for now (will be validated on submit)
      return { hasSubmitted: false };
    },
    retry: 1,
    gcTime: 0,
    staleTime: 0, // BUGFIX: Ensure query is always considered stale, forces refetch
    enabled: !!user, // Only run for authenticated users
  });

  // Fetch user profile for authenticated users (V2 endpoint)
  const { data: authenticatedProfile, isLoading: loadingAuthProfile } =
    useQuery({
      queryKey: ["student-profile", user?.email],
      queryFn: async () => {
        const { data } = await axios.get("/api/user/profile");
        // V2: Extract profile from nested structure
        return {
          studentName: data.profile?.studentName || "",
          schoolName: data.profile?.schoolName || "",
          className: data.profile?.className || "",
          rollNumber: data.profile?.rollNumber || "",
          mobileNumber: data.profile?.mobileNumber || "",
          address: data.profile?.address || "",
        };
      },
      retry: 1,
      gcTime: 0,
      enabled: !!user, // Only fetch if user is authenticated
    });

  // V2: Public user profile lookup disabled (V2 requires authentication)
  // Fetch StudentProfile by mobile number for public users (after they enter mobile)
  const { data: publicProfile, isLoading: loadingPublicProfile } = useQuery({
    queryKey: ["student-profile-mobile", mobileForProfile],
    queryFn: async () => {
      // V2: Public users are no longer supported
      // All users must authenticate
      console.log("V2: Public user support disabled");
      return null;
    },
    retry: 1,
    gcTime: 0,
    enabled: false, // Disabled for V2
  });

  // Get quiz info
  const {
    data: quiz,
    isLoading: loadingQuiz,
    error: quizError,
  } = useQuery({
    queryKey: ["quiz-info", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/quizzes/${id}`);
      return data;
    },
    retry: 1,
    gcTime: 0,
  });

  // Generate storage key for both authenticated and public users
  const getStorageKey = () => {
    if (user?.email) {
      return `studentData_${user.email}`;
    }
    // For public users, use a shared key across all quizzes (not per-quiz)
    return `studentData_public`;
  };

  // Load existing student data from localStorage on component mount (ONLY for public users or first-time visit)
  useEffect(() => {
    // Skip localStorage for authenticated users - they should use API data
    if (user?.email) {
      return;
    }

    const storageKey = getStorageKey();
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setStudentInfo(parsedData);
        setOriginalProfileData(parsedData); // Also set original to match
      } catch {
        // Data corrupted, start fresh
      }
    }
  }, [user?.email, id]);

  // Load StudentProfile data if authenticated user
  useEffect(() => {
    if (authenticatedProfile && user?.email) {
      const profileData = {
        studentName: authenticatedProfile.studentName || "",
        schoolName: authenticatedProfile.schoolName || "",
        className: authenticatedProfile.className || "",
        rollNumber: authenticatedProfile.rollNumber || "",
        mobileNumber: authenticatedProfile.mobileNumber || "",
        address: authenticatedProfile.address || "",
      };
      setStudentInfo(profileData);
      // Store original profile data to detect changes later
      setOriginalProfileData(profileData);
    }
  }, [authenticatedProfile, user?.email]);

  // Load StudentProfile data if public user provided mobile number
  useEffect(() => {
    if (publicProfile && !user) {
      const profileData = {
        studentName: publicProfile.studentName || "",
        schoolName: publicProfile.schoolName || "",
        className: publicProfile.className || "",
        rollNumber: publicProfile.rollNumber || "",
        mobileNumber: publicProfile.mobileNumber || "",
        address: publicProfile.address || "",
      };
      setStudentInfo(profileData);
      // Store original profile data to detect changes later
      setOriginalProfileData(profileData);
    }
  }, [publicProfile, user]);

  // Check if profile data has changed (with type-safe comparison)
  // Returns false if originalProfileData is still in initial state (not loaded yet)
  const hasProfileChanged = () => {
    // Safety check: if originalProfileData is empty and hasn't been initialized, return false
    const isOriginalDataEmpty =
      !originalProfileData.studentName &&
      !originalProfileData.schoolName &&
      !originalProfileData.className &&
      !originalProfileData.rollNumber &&
      !originalProfileData.mobileNumber &&
      !originalProfileData.address;

    if (isOriginalDataEmpty) {
      return false; // Data not loaded yet, no change to report
    }

    // Normalize values for comparison (trim strings, convert to same type)
    const normalize = (val) => {
      if (val === null || val === undefined) return "";
      return String(val).trim();
    };

    return (
      normalize(studentInfo.studentName) !==
        normalize(originalProfileData.studentName) ||
      normalize(studentInfo.schoolName) !==
        normalize(originalProfileData.schoolName) ||
      normalize(studentInfo.className) !==
        normalize(originalProfileData.className) ||
      normalize(studentInfo.rollNumber) !==
        normalize(originalProfileData.rollNumber) ||
      normalize(studentInfo.mobileNumber) !==
        normalize(originalProfileData.mobileNumber) ||
      normalize(studentInfo.address) !== normalize(originalProfileData.address)
    );
  };

  // Handle field change with validation
  const handleFieldChange = (name, value) => {
    setStudentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If mobile number is being set and it looks valid, trigger profile lookup (for public users)
    if (name === "mobileNumber" && !user && validateBangladeshiPhone(value)) {
      setMobileForProfile(value);
    }

    // Validate field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};

    newErrors.studentName = validateField(
      "studentName",
      studentInfo.studentName,
    );
    newErrors.mobileNumber = validateField(
      "mobileNumber",
      studentInfo.mobileNumber,
    );
    newErrors.schoolName = validateField("schoolName", studentInfo.schoolName);
    newErrors.className = validateField("className", studentInfo.className);
    newErrors.rollNumber = validateField("rollNumber", studentInfo.rollNumber);
    newErrors.address = validateField("address", studentInfo.address);

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("সব ফিল্ড সঠিকভাবে পূরণ করুন");
      return;
    }

    setIsSubmitting(true);

    try {
      const storageKey = getStorageKey();

      // Save updated data to localStorage
      localStorage.setItem(storageKey, JSON.stringify(studentInfo));

      // Only update profile on backend if data has changed (for authenticated users)
      if (user?.email && hasProfileChanged()) {
        try {
          // V2: Update profile via user profile endpoint
          await axios.put("/api/user/profile", {
            studentName: studentInfo.studentName,
            schoolName: studentInfo.schoolName,
            className: studentInfo.className,
            rollNumber: studentInfo.rollNumber,
            mobileNumber: studentInfo.mobileNumber,
            address: studentInfo.address,
          });
          toast.success("প্রোফাইল আপডেট করা হয়েছে! কুইজ শুরু হচ্ছে...");
        } catch (profileErr) {
          // If profile update fails, still proceed with the quiz
          console.warn("Could not update profile on backend:", profileErr);
          toast.warning("কুইজ শুরু হচ্ছে... (প্রোফাইল আপডেট ব্যর্থ)");
        }
      } else {
        // No profile changes or public user - proceed directly without API call
        toast.success("কুইজ শুরু হচ্ছে...");
      }

      // Store complete student info in session for quiz taking
      sessionStorage.setItem("studentInfo", JSON.stringify(studentInfo));

      // Navigate to quiz after brief delay
      setTimeout(() => {
        navigate(`/quiz/${id}/take`);
        setIsSubmitting(false);
      }, 600);
    } catch (error) {
      toast.error("কিছু একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  // Wait for quiz to load, auth check to complete, AND submission check to complete (if user is authenticated)
  if (loadingQuiz || !authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Wait for submission check if user is authenticated
  if (user && checkingSubmission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-gray-600">চেক করছি...</p>
        </div>
      </div>
    );
  }

  // Show error if quiz not found or API failed
  if (quizError || checkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-red-200">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
              <MdError className="text-5xl text-white" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
              কুইজ খুঁজে পাওয়া যায়নি ❌
            </h1>
            <p className="text-gray-600 text-center mb-8">
              দুঃখিত, এই কুইজটি আর উপলব্ধ নয় অথবা আপনার অ্যাক্সেস নেই।
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to="/quizzes"
                className="btn btn-gradient btn-lg gap-2 flex-1"
              >
                <FaArrowRight />
                অন্য কুইজ দেখুন
              </Link>
              <Link to="/" className="btn btn-outline btn-lg flex-1">
                হোম এ যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if quiz data not loaded
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-red-200">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
              <MdError className="text-5xl text-white" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
              ডেটা লোড ব্যর্থ ❌
            </h1>
            <p className="text-gray-600 text-center mb-8">
              কুইজের তথ্য লোড করতে সমস্যা হচ্ছে। দয়া করে পুনরায় চেষ্টা করুন।
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-gradient btn-lg flex-1"
              >
                পুনরায় চেষ্টা করুন
              </button>
              <Link to="/quizzes" className="btn btn-outline btn-lg flex-1">
                ফিরে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If already submitted, show their performance/results
  if (checkData?.hasSubmitted && checkData?.submission) {
    const {
      score,
      timeTaken,
      totalQuestions = quiz?.questions?.length || 0,
    } = checkData.submission;
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 flex items-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-purple-100">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
              <FaTrophy className="text-5xl text-white" />
            </div>

            {/* Already Submitted Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
              আপনি ইতিমধ্যে অংশগ্রহণ করেছেন ✅
            </h1>
            <p className="text-gray-600 text-center mb-1 text-lg">
              You have already completed this quiz
            </p>
            <p className="text-gray-500 text-center mb-8 text-sm">
              প্রতিটি শিক্ষার্থী শুধুমাত্র একবার এই কুইজে অংশ নিতে পারবেন। নতুন
              প্রচেষ্টার জন্য পুনরায় শুরু করা যাবে না।
            </p>

            {/* Performance Score Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
              <p className="font-bold text-blue-900 mb-6 flex items-center gap-2 text-lg">
                <FaCheckCircle className="text-green-500 text-xl" />
                আপনার পারফরম্যান্স
              </p>

              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {/* Score */}
                <div className="text-center">
                  <p className="text-xs md:text-sm text-blue-700 font-semibold mb-2 uppercase tracking-wide">
                    স্কোর
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-blue-900">
                    {score}/{totalQuestions}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-indigo-600 mt-1">
                    {percentage}%
                  </p>
                </div>

                {/* Time Taken */}
                <div className="text-center border-l border-r border-blue-200">
                  <p className="text-xs md:text-sm text-blue-700 font-semibold mb-2 uppercase tracking-wide">
                    সময়
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-900">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">মিনিট</p>
                </div>

                {/* Average Time */}
                <div className="text-center">
                  <p className="text-xs md:text-sm text-blue-700 font-semibold mb-2 uppercase tracking-wide">
                    প্রতি প্রশ্ন
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-900">
                    {totalQuestions > 0
                      ? Math.round(timeTaken / totalQuestions)
                      : 0}
                    s
                  </p>
                  <p className="text-sm text-blue-600 mt-1">সেকেন্ড</p>
                </div>
              </div>

              {/* Performance Feedback */}
              <div className="mt-6 p-4 rounded-lg bg-white/70 border border-blue-100">
                <p className="text-sm md:text-base font-semibold text-slate-800">
                  {percentage >= 80 ? (
                    <span className="text-green-600">
                      🌟 চমৎকার পারফরম্যান্স! আপনি দুর্দান্ত করেছেন।
                    </span>
                  ) : percentage >= 60 ? (
                    <span className="text-blue-600">
                      👍 ভালো পারফরম্যান্স! আরও উন্নতির জায়গা আছে।
                    </span>
                  ) : percentage >= 40 ? (
                    <span className="text-amber-600">
                      📚 আরও অনুশীলনের প্রয়োজন। পরবর্তী কুইজে ভাল করুন।
                    </span>
                  ) : (
                    <span className="text-red-600">
                      💪 চেষ্টা করতে থাকুন। প্রতিটি শিক্ষা মূল্যবান।
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={`/quiz/${id}/result`}
                className="btn btn-gradient btn-lg w-full gap-2 flex justify-center"
              >
                <FaCheckCircle className="text-lg" />
                আপনার বিস্তারিত ফলাফল দেখুন
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/quiz/${id}/leaderboard`}
                  className="btn btn-outline btn-lg w-full gap-2 flex justify-center text-sm"
                >
                  <FaTrophy />
                  লিডারবোর্ড
                </Link>
                <Link
                  to="/quizzes"
                  className="btn btn-outline btn-lg w-full gap-2 flex justify-center text-sm"
                >
                  <FaArrowRight />
                  নতুন কুইজ
                </Link>
              </div>
            </div>

            {/* Disabled Message */}
            <div className="mt-6 p-4 rounded-lg bg-amber-50 border-l-4 border-amber-400">
              <p className="text-sm text-amber-900 font-semibold flex items-center gap-2">
                <span className="text-lg">🔒</span>
                নতুন প্রচেষ্টা নিষ্ক্রিয়
              </p>
              <p className="text-xs text-amber-800 mt-1">
                এই কুইজটি আপনি ইতিমধ্যে সম্পন্ন করেছেন। প্রতিটি কুইজে মাত্র একটি
                প্রচেষ্টার অনুমতি রয়েছে।
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  md:py-8">
      <div className="container mx-auto md:px-4 max-w-3xl">
        {/* Top Section - Quiz Info */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 md:p-10 shadow-2xl relative overflow-hidden border border-indigo-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
              {quiz?.title}
            </h1>
            <p className="text-indigo-100 text-sm md:text-base mb-5 max-w-2xl leading-relaxed">
              {quiz?.description}
            </p>

            {/* Quiz Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-xs text-indigo-200">সময় সীমা</p>
                  <span className="font-bold text-lg">
                    {quiz?.timeLimit} মিনিট
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/15 transition-all">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="text-xs text-indigo-200">প্রশ্ন সংখ্যা</p>
                  <span className="font-bold text-lg">
                    {quiz?.questions?.length} টি
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-200 px-6 md:px-10 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                ✓
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  শিক্ষার্থীর তথ্য
                </h2>
                <p className="text-slate-600 text-xs md:text-sm mt-0.5">
                  কুইজ শুরু করার আগে নিচের ফর্মটি পূরণ করো
                  {studentInfo.studentName && (
                    <span className="inline-flex items-center gap-2 ml-2 text-green-600 font-semibold">
                      <FaCheckCircle className="text-sm" />
                      পূর্বের তথ্য পাওয়া গেছে
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
            {/* Important Note */}

            {/* Personal Information Section */}
            <div className="space-y-5">
              {/* নাম */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  পূর্ণ নাম <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 font-normal text-sm transition-all focus:outline-none ${
                    errors.studentName
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  value={studentInfo.studentName}
                  onChange={(e) =>
                    handleFieldChange("studentName", e.target.value)
                  }
                  required
                />
                {errors.studentName && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                    <MdError /> {errors.studentName}
                  </p>
                )}
              </div>

              {/* মোবাইল নম্বর */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  মোবাইল নম্বর <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 font-normal text-sm transition-all focus:outline-none ${
                    errors.mobileNumber
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  value={studentInfo.mobileNumber}
                  onChange={(e) =>
                    handleFieldChange("mobileNumber", e.target.value)
                  }
                  required
                />
                {errors.mobileNumber && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                    <MdError /> {errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Educational Information Section */}
            <div className="space-y-4">
              {/* শিক্ষা প্রতিষ্ঠান */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  শিক্ষা প্রতিষ্ঠান{" "}
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="স্কুল/কলেজ/বিশ্ববিদ্যালয়ের নাম"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 font-normal text-sm transition-all focus:outline-none ${
                    errors.schoolName
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  value={studentInfo.schoolName}
                  onChange={(e) =>
                    handleFieldChange("schoolName", e.target.value)
                  }
                  required
                />
                {errors.schoolName && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                    <MdError /> {errors.schoolName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ক্লাস */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ক্লাস/শ্রেণি{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-lg border-2 font-normal text-sm transition-all focus:outline-none appearance-none bg-white cursor-pointer ${
                      errors.className
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"12\\" height=\\"8\\" viewBox=\\"0 0 12 8\\"><path fill=\\"%236B7280\\" d=\\"M1 1l5 5 5-5\\"/></svg>") no-repeat',
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5rem",
                      paddingRight: "2.5rem",
                    }}
                    value={studentInfo.className}
                    onChange={(e) =>
                      handleFieldChange("className", e.target.value)
                    }
                    required
                  >
                    <option value="">নির্বাচন করুন</option>
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                  {errors.className && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <MdError /> {errors.className}
                    </p>
                  )}
                </div>

                {/* রোল নম্বর */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    রোল নম্বর <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="০, ১, ২... বা 0, 1, 2..."
                    className={`w-full px-4 py-2.5 rounded-lg border-2 font-normal text-sm transition-all focus:outline-none ${
                      errors.rollNumber
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    value={studentInfo.rollNumber}
                    onChange={(e) =>
                      handleFieldChange("rollNumber", e.target.value)
                    }
                    required
                  />
                  {errors.rollNumber && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <MdError /> {errors.rollNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <FaMapMarkerAlt className="text-lg" />
                </div>
                ঠিকানা
              </h3>

              {/* ঠিকানা */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  সম্পূর্ণ ঠিকানা{" "}
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  placeholder="যেমন: গ্রাম - সুরজপুর, থানা - কসবা, জেলা - ব্রাহ্মণবাড়িয়া"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 font-normal text-sm transition-all focus:outline-none resize-none h-20 ${
                    errors.address
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  value={studentInfo.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  required
                />
                {errors.address && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                    <MdError /> {errors.address}
                  </p>
                )}
                <p className="text-slate-500 text-xs mt-2">
                  কমপক্ষে ১০ অক্ষর এবং সম্পূর্ণ ঠিকানা লিখুন
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between md:justify-end gap-4 border-slate-200 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn bg-gradient-to-r px-4 from-purple-500 to-indigo-600 text-white font-medium text-base rounded-xl hover:from-indigo-700 hover:to-purple-700 border-none shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    প্রক্রিয়াজনকরণ হচ্ছে...
                  </>
                ) : (
                  <>
                    <FaPlay className="text-sm md:text-lg" />
                    কুইজ শুরু করো
                  </>
                )}
              </button>

              {/* <Link
                to="/quizzes"
                className="btn px-4 rounded-xl  bg-purple-600 text-white border-purple-600 font-semibold"
              >
                ফিরে যাও
                <MdOutlineArrowOutward className="text-sm md:text-lg" />
              </Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreQuizForm;
