import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaBookOpen,
  FaCalendarAlt,
  FaCheck,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSchool,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { MdOutlineLeaderboard, MdOutlineQuiz } from "react-icons/md";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import {
  validateAllProfileFields,
  validateField,
} from "../utils/profileValidation";

const StudentDashboard = () => {
  const { dbUser, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [editForm, setEditForm] = useState({
    studentName: "",
    schoolName: "",
    className: "",
    rollNumber: "",
    mobileNumber: "",
    address: "",
  });

  const { data: profileData = {}, isLoading: profileLoading } = useQuery({
    queryKey: ["student-profile", dbUser?.email],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/profile");
      // V2: Return nested profile structure
      return data;
    },
    enabled: !!dbUser,
  });

  // Extract profile and statistics from V2 response
  const profile = profileData.profile || {};
  const statistics = profileData.statistics || {};

  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ["student-quizzes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/quizzes");
      return data;
    },
    enabled: !!dbUser,
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["student-results"],
    queryFn: async () => {
      const { data } = await axios.get("/api/published-results");
      return data;
    },
    enabled: !!dbUser,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const { data } = await axios.put("/api/user/profile", profileData);
      return data;
    },
    onSuccess: () => {
      toast.success("প্রোফাইল আপডেট করা হয়েছে!");
      queryClient.invalidateQueries(["student-profile", dbUser?.email]);
      setIsEditMode(false);
      setEditErrors({});
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে";
      toast.error(message);
      if (error.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      }
    },
  });

  // Validation using shared utility
  const validateForm = () => {
    const newErrors = validateAllProfileFields(editForm);
    setEditErrors(newErrors);
    // Check if all error values are empty (no errors)
    return Object.values(newErrors).every((error) => !error);
  };

  const handleEditClick = () => {
    setEditForm({
      studentName: profile.studentName || "",
      schoolName: profile.schoolName || "",
      className: profile.className || "",
      rollNumber: profile.rollNumber || "",
      mobileNumber: profile.mobileNumber || "",
      address: profile.address || "",
    });
    setIsEditMode(true);
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error("সব ফিল্ড সঠিকভাবে পূরণ করুন");
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditErrors({});
  };

  const handleFieldChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Validate field in real-time
    const error = validateField(field, value);
    setEditErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-white"></div>
          <p className="mt-4 text-white/90 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dbUser) {
    return <Navigate to="/login" replace />;
  }

  const activeQuizzes = quizzes.filter(
    (quiz) => quiz.status === "active",
  ).length;
  const upcomingQuizzes = quizzes.filter(
    (quiz) => quiz.status === "scheduled",
  ).length;
  const availableQuizzes = quizzes.filter(
    (quiz) => quiz.status !== "draft",
  ).length;
  const publishedResults = results.length;

  const profileFields = [
    profile.studentName,
    profile.schoolName,
    profile.className,
    profile.rollNumber,
    profile.mobileNumber,
    profile.address,
  ];
  const profileCompletion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  );

  const quickStats = [
    {
      label: "Available Quizzes",
      value: availableQuizzes,
      icon: <MdOutlineQuiz className="text-3xl" />,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      label: "Active Now",
      value: activeQuizzes,
      icon: <FaBookOpen className="text-3xl" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      label: "Upcoming",
      value: upcomingQuizzes,
      icon: <FaCalendarAlt className="text-3xl" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      label: "Published Results",
      value: publishedResults,
      icon: <MdOutlineLeaderboard className="text-3xl" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  if (profileLoading || quizzesLoading || resultsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-white"></div>
          <p className="mt-4 text-white/90 text-lg font-medium">
            Loading student data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 py-8 md:py-14 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 md:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                {dbUser.picture ? (
                  <img
                    src={dbUser.picture}
                    alt={dbUser.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-3xl sm:text-4xl" />
                )}
              </div>
              <div>
                <p className="text-white/80 text-sm uppercase tracking-[0.2em]">
                  Student Dashboard
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 leading-tight">
                  Welcome, {dbUser.name}
                </h1>
                <p className="text-white/85 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Track your quiz activity, profile details, and platform
                  updates from one clean overview.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto lg:min-w-[360px]">
              <Link
                to="/quizzes"
                className="btn w-full bg-white text-indigo-700 hover:bg-indigo-50 border-0 rounded-xl shadow-lg"
              >
                Take Quiz
                <FaArrowRight />
              </Link>
              <Link
                to="/results"
                className="btn w-full btn-outline border-white/40 text-white hover:bg-white/10 rounded-xl"
              >
                View Results
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-12 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <div className={`${stat.bgColor} p-2.5 sm:p-3 rounded-xl`}>
                  <div className={stat.textColor}>{stat.icon}</div>
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Student Profile
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {isEditMode
                    ? "প্রোফাইল সম্পাদনা করুন"
                    : "আপনার তথ্য আপডেট রাখুন"}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {!isEditMode && (
                  <>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Profile completeness
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                        {profileCompletion}%
                      </p>
                    </div>
                    <button
                      onClick={handleEditClick}
                      className="btn btn-xs btn-secondary gap-2 rounded-xl"
                    >
                      <FaEdit /> সম্পাদনা
                    </button>
                  </>
                )}
              </div>
            </div>

            {!isEditMode ? (
              // Display Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField
                  label="Student Name"
                  value={profile.studentName}
                />
                <ProfileField
                  label="School"
                  value={profile.schoolName}
                  icon={FaSchool}
                />
                <ProfileField label="Class" value={profile.className} />
                <ProfileField label="Roll Number" value={profile.rollNumber} />
                <ProfileField
                  label="Mobile Number"
                  value={profile.mobileNumber}
                  icon={FaPhone}
                />
                <ProfileField
                  label="Address"
                  value={profile.address}
                  icon={FaMapMarkerAlt}
                />
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.studentName}
                      onChange={(e) =>
                        handleFieldChange("studentName", e.target.value)
                      }
                      className={`input input-bordered w-full rounded-xl ${
                        editErrors.studentName ? "input-error" : ""
                      }`}
                      placeholder="আপনার পূর্ণ নাম"
                    />
                    {editErrors.studentName && (
                      <p className="text-sm text-red-500 mt-1">
                        {editErrors.studentName}
                      </p>
                    )}
                  </div>

                  {/* School Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      শিক্ষা প্রতিষ্ঠান <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.schoolName}
                      onChange={(e) =>
                        handleFieldChange("schoolName", e.target.value)
                      }
                      className={`input input-bordered w-full rounded-xl ${
                        editErrors.schoolName ? "input-error" : ""
                      }`}
                      placeholder="আপনার স্কুল/কলেজের নাম"
                    />
                    {editErrors.schoolName && (
                      <p className="text-sm text-red-500 mt-1">
                        {editErrors.schoolName}
                      </p>
                    )}
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ক্লাস <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editForm.className}
                      onChange={(e) =>
                        handleFieldChange("className", e.target.value)
                      }
                      className={`select select-bordered w-full rounded-xl ${
                        editErrors.className ? "select-error" : ""
                      }`}
                    >
                      <option value="">ক্লাস নির্বাচন করুন</option>
                      {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                        <option key={cls} value={cls}>
                          Class {cls}
                        </option>
                      ))}
                    </select>
                    {editErrors.className && (
                      <p className="text-sm text-red-500 mt-1">
                        {editErrors.className}
                      </p>
                    )}
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      রোল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.rollNumber}
                      onChange={(e) =>
                        handleFieldChange("rollNumber", e.target.value)
                      }
                      className={`input input-bordered w-full rounded-xl ${
                        editErrors.rollNumber ? "input-error" : ""
                      }`}
                      placeholder="রোল নম্বর"
                    />
                    {editErrors.rollNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {editErrors.rollNumber}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editForm.mobileNumber}
                      onChange={(e) =>
                        handleFieldChange("mobileNumber", e.target.value)
                      }
                      className={`input input-bordered w-full rounded-xl ${
                        editErrors.mobileNumber ? "input-error" : ""
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {editErrors.mobileNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {editErrors.mobileNumber}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) =>
                        handleFieldChange("address", e.target.value)
                      }
                      className={`textarea textarea-bordered w-full rounded-xl ${
                        editErrors.address ? "textarea-error" : ""
                      }`}
                      placeholder="আপনার সম্পূর্ণ ঠিকানা"
                      rows="3"
                    />
                    {editErrors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {editErrors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="btn btn-primary gap-2 rounded-xl flex-1 w-full"
                  >
                    <FaCheck />
                    {updateProfileMutation.isPending
                      ? "সংরক্ষণ করা হচ্ছে..."
                      : "সংরক্ষণ করুন"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={updateProfileMutation.isPending}
                    className="btn btn-outline gap-2 rounded-xl flex-1 w-full"
                  >
                    <FaTimes />
                    বাতিল করুন
                  </button>
                </div>
              </div>
            )}

            {!isEditMode && !profile.studentName && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                আপনার প্রোফাইল এখনও সম্পূর্ণ হয়নি। উপরে "সম্পাদনা করুন" ক্লিক
                করে আপনার তথ্য যোগ করুন।
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Account Overview
            </h2>

            <div className="space-y-4">
              <InfoRow icon={FaEnvelope} label="Email" value={dbUser.email} />
              <InfoRow
                icon={FaUserCircle}
                label="Role"
                value={dbUser.role === "admin" ? "Administrator" : "Student"}
              />
              <InfoRow
                icon={FaSchool}
                label="Institution"
                value={profile.schoolName || "Not set yet"}
              />
            </div>

            {/* V2: Statistics Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📊 Your Statistics
              </h3>
              <div className="space-y-3">
                <StatRow
                  label="Quizzes Attempted"
                  value={statistics.totalQuizzesAttempted || 0}
                />
                <StatRow
                  label="Total Points Earned"
                  value={statistics.totalPoints || 0}
                />
                <StatRow
                  label="Quizzes Won"
                  value={statistics.quizzesWon || 0}
                />
                {statistics.lastQuizTakenAt && (
                  <StatRow
                    label="Last Quiz Taken"
                    value={new Date(
                      statistics.lastQuizTakenAt,
                    ).toLocaleDateString("bn-BD")}
                  />
                )}
              </div>
            </div>

            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <p className="text-xs sm:text-sm font-semibold text-indigo-700 uppercase tracking-wide">
                Next step
              </p>
              <p className="text-sm sm:text-base text-gray-800 mt-2 leading-relaxed">
                Check active quizzes, complete your profile through submission,
                and view published results from the result board.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/quizzes" className="btn btn-primary w-full gap-2">
                  Browse Quizzes <FaArrowRight />
                </Link>
                <Link to="/results" className="btn btn-outline w-full gap-2">
                  View Published Results
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-indigo-300 uppercase tracking-[0.2em] text-[10px] sm:text-xs font-semibold">
                Student access
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 leading-tight">
                Stay updated with quizzes, results, and notices.
              </h3>
              <p className="text-white/75 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                This dashboard is built to keep students focused on the next
                action, without exposing admin tools or clutter.
              </p>
            </div>
            <Link
              to="/quizzes"
              className="btn btn-lg btn-primary gap-2 w-full md:w-auto"
            >
              Start a Quiz <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
      {label}
    </p>
    <div className="flex items-start gap-3">
      {Icon ? <Icon className="text-gray-400 mt-1" /> : null}
      <p className="text-sm sm:text-base text-gray-900 font-semibold break-words leading-relaxed">
        {value || "Not available yet"}
      </p>
    </div>
  </div>
);

const InfoRow = ({ icon, label, value }) => {
  const Icon = icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
      <div className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 flex-shrink-0">
        <Icon />
      </div>
      <div>
        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 font-semibold">
          {label}
        </p>
        <p className="text-sm sm:text-base text-gray-900 font-medium mt-1 break-words leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
};

const SnapshotCard = ({ title, value, description, tone }) => (
  <div className="rounded-2xl border border-gray-100 p-5 bg-gradient-to-br from-white to-gray-50 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${tone}`} />
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
    <h3 className="font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <p className="text-lg font-bold text-indigo-600">{value}</p>
  </div>
);

export default StudentDashboard;
