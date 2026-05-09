import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhone,
  FaSchool,
  FaUser,
} from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import {
  validateAllProfileFields,
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

const MembershipApplication = () => {
  const navigate = useNavigate();
  const { dbUser, loading: authLoading, authCheckComplete } = useAuth();

  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    schoolName: "",
    className: "",
    rollNumber: "",
    mobileNumber: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch user profile
  const { data: authenticatedProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["student-profile", dbUser?.email],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/profile");
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
    enabled: !!dbUser,
  });

  // Fetch user's membership status
  const { data: membershipData } = useQuery({
    queryKey: ["user-membership", dbUser?.email],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/membership");
      return data;
    },
    retry: 1,
    enabled: !!dbUser,
  });

  // Load profile data when fetched
  useEffect(() => {
    if (authenticatedProfile && dbUser?.email) {
      setStudentInfo(authenticatedProfile);
    }
  }, [authenticatedProfile, dbUser?.email]);

  // Handle field change with validation
  const handleFieldChange = (name, value) => {
    setStudentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = validateAllProfileFields(studentInfo);
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("সব ফিল্ড সঠিকভাবে পূরণ করুন");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile on backend if changed
      await axios.put("/api/user/profile", {
        studentName: studentInfo.studentName,
        schoolName: studentInfo.schoolName,
        className: studentInfo.className,
        rollNumber: studentInfo.rollNumber,
        mobileNumber: studentInfo.mobileNumber,
        address: studentInfo.address,
      });

      toast.success("প্রোফাইল আপডেট করা হয়েছে!");

      // Store in sessionStorage and navigate to declaration
      sessionStorage.setItem("membershipData", JSON.stringify(studentInfo));
      setTimeout(() => {
        navigate("/membership/declaration");
        setIsSubmitting(false);
      }, 600);
    } catch (error) {
      const message =
        error.response?.data?.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে";
      toast.error(message);
      setIsSubmitting(false);
    }
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

  // Check membership status - redirect if already active or pending
  if (membershipData?.membership) {
    const status = membershipData.membership.status;

    if (status === "active") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 flex items-center">
          <div className="container mx-auto md:px-4 max-w-2xl px-2">
            <div className="bg-white md:rounded-3xl p-8 md:p-12 border border-green-200 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                আপনি সক্রিয় সদস্য
              </h1>
              <p className="text-center text-gray-600 mb-8">
                আপনার সদস্যপদ সফলভাবে অনুমোদিত হয়েছে। আপনি এখন সমস্ত সুবিধা
                উপভোগ করতে পারেন।
              </p>
              <div className="flex gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium py-3 rounded-xl"
                >
                  ড্যাশবোর্ডে যান
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 flex items-center">
          <div className="container mx-auto md:px-4 max-w-2xl px-2">
            <div className="bg-white md:rounded-3xl p-8 md:p-12 border border-amber-200 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">⏳</span>
              </div>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                আবেদন পর্যালোচনায়
              </h1>
              <p className="text-center text-gray-600 mb-8">
                আপনার সদস্যপদ আবেদন প্রশাসক দ্বারা পর্যালোচনা করা হচ্ছে। শীঘ্রই
                ফলাফল পাবেন।
              </p>
              <div className="flex gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium py-3 rounded-xl"
                >
                  ড্যাশবোর্ডে যান
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 flex items-center">
          <div className="container mx-auto md:px-4 max-w-2xl px-2">
            <div className="bg-white md:rounded-3xl p-8 md:p-12 border border-red-200 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <MdError className="text-4xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                আবেদন প্রত্যাখ্যান করা হয়েছে
              </h1>
              <p className="text-center text-gray-600 mb-4">
                {membershipData.membership.rejectionReason ||
                  "দুঃখিত, আপনার সদস্যপদ আবেদন প্রত্যাখ্যান করা হয়েছে।"}
              </p>
              <p className="text-center text-gray-600 mb-8">
                আপনি পুনরায় আবেদন করতে পারেন।
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium py-3 rounded-xl"
                >
                  আবার আবেদন করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
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
              <h1 className="text-2xl md:text-3xl font-bold">সদস্যপদ আবেদন</h1>
            </div>
            <p className="text-indigo-100 text-sm md:text-base">
              কিশোরকণ্ঠ পাঠক ফোরাম এর সদস্য হতে আপনার তথ্য প্রদান করুন
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-200 px-6 md:px-10 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                1
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  আপনার তথ্য
                </h2>
                <p className="text-slate-600 text-xs md:text-sm mt-0.5">
                  সব ফিল্ড পূরণ করুন
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleNext} className="p-6 md:p-10 space-y-6">
            {/* Student Name */}
            <div className="form-group">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                  <FaUser className="text-indigo-600" />
                  শিক্ষার্থীর নাম *
                </span>
              </label>
              <input
                type="text"
                placeholder="আপনার সম্পূর্ণ নাম"
                className={`input input-bordered w-full bg-white border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                  errors.studentName ? "border-red-500" : "border-gray-300"
                }`}
                value={studentInfo.studentName}
                onChange={(e) =>
                  handleFieldChange("studentName", e.target.value)
                }
              />
              {errors.studentName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.studentName}
                </p>
              )}
            </div>

            {/* School Name */}
            <div className="form-group">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                  <FaSchool className="text-indigo-600" />
                  শিক্ষা প্রতিষ্ঠানের নাম *
                </span>
              </label>
              <input
                type="text"
                placeholder="স্কুল/কলেজ/মাদ্রাসার নাম"
                className={`input input-bordered w-full bg-white border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                  errors.schoolName ? "border-red-500" : "border-gray-300"
                }`}
                value={studentInfo.schoolName}
                onChange={(e) =>
                  handleFieldChange("schoolName", e.target.value)
                }
              />
              {errors.schoolName && (
                <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
              )}
            </div>

            {/* Class */}
            <div className="form-group">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  শ্রেণি *
                </span>
              </label>
              <select
                className={`select select-bordered w-full bg-white border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                  errors.className ? "border-red-500" : "border-gray-300"
                }`}
                value={studentInfo.className}
                onChange={(e) => handleFieldChange("className", e.target.value)}
              >
                <option value="">নির্বাচন করুন</option>
                {CLASS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.className && (
                <p className="text-red-500 text-sm mt-1">{errors.className}</p>
              )}
            </div>

            {/* Roll Number */}
            <div className="form-group">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  রোল নম্বর
                </span>
              </label>
              <input
                type="text"
                placeholder="রোল নম্বর"
                className={`input input-bordered w-full bg-white border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                  errors.rollNumber ? "border-red-500" : "border-gray-300"
                }`}
                value={studentInfo.rollNumber}
                onChange={(e) =>
                  handleFieldChange("rollNumber", e.target.value)
                }
              />
              {errors.rollNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.rollNumber}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="form-group">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                  <FaPhone className="text-indigo-600" />
                  মোবাইল নম্বর *
                </span>
              </label>
              <input
                type="tel"
                placeholder="01700000000"
                className={`input input-bordered w-full bg-white border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                  errors.mobileNumber ? "border-red-500" : "border-gray-300"
                }`}
                value={studentInfo.mobileNumber}
                onChange={(e) =>
                  handleFieldChange("mobileNumber", e.target.value)
                }
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-indigo-600" />
                  ঠিকানা *
                </span>
              </label>
              <textarea
                placeholder="আপনার সম্পূর্ণ ঠিকানা"
                className={`textarea textarea-bordered w-full bg-white border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                rows="3"
                value={studentInfo.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                to="/"
                className="btn btn-outline flex-1 rounded-xl font-medium"
              >
                <FaArrowLeft />
                বাতিল
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium flex-1 rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    প্রক্রিয়াকরণ...
                  </>
                ) : (
                  <>
                    পরবর্তী
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipApplication;
