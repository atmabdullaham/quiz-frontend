import { useEffect, useState } from "react";
import Toast from "react-hot-toast";
import { FaMedal, FaTrash } from "react-icons/fa";
import axios from "../utils/axios";

// Helper function to determine group based on class
const getGroupByClass = (className) => {
  if (!className) return null;

  const classStr = String(className).toLowerCase().trim();
  const parts = classStr.split(/[\s,\-./]+/);

  // Group 3: অগ্রপথিক (11th-12th) - Check first to avoid "1" matching in group 1
  if (parts.some((part) => ["11", "12"].includes(part))) {
    return "অগ্রপথিক";
  }

  // Group 2: প্রত্যয় (8th-10th)
  if (parts.some((part) => ["8", "9", "10"].includes(part))) {
    return "প্রত্যয়";
  }

  // Group 1: স্বপ্নিল (4th-7th)
  if (parts.some((part) => ["4", "5", "6", "7"].includes(part))) {
    return "স্বপ্নিল";
  }

  return null;
};

const GROUPS = {
  সকল: { label: "সকল গ্রুপ", key: "all" },
  স্বপ্নিল: { label: "१ম গ্রুপ - স্বপ্নিল (४র्थ-७ম)", key: "swapnil" },
  প্রত্যয়: { label: "२य় গ্রুপ - প্রত্যয় (०८ম-०१०ম)", key: "prottoy" },
  অগ্রপথিক: { label: "०३য় গ্রুপ - অগ্রপথিক (००११শ-००१२শ)", key: "ogropothik" },
};

const PublishResultModal = ({ quizId, quizTitle, onClose, onPublished }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(true);
  const [error, setError] = useState("");
  const [topCount, setTopCount] = useState(10);
  const [selectedGroup, setSelectedGroup] = useState("সকল");

  useEffect(() => {
    prepareResults();
  }, [quizId]);

  // Update filtered winners when group or topCount changes
  useEffect(() => {
    const filtered =
      selectedGroup === "সকল"
        ? candidates
        : candidates.filter((c) => c.group === selectedGroup);

    setSelectedWinners(filtered.slice(0, topCount));
  }, [selectedGroup, topCount, candidates]);

  // VERSION 2: Simplified - no more publishType
  const prepareResults = async () => {
    try {
      setPreparing(true);
      setError("");

      // Get all submissions for the quiz
      const response = await axios.get(
        `/api/admin/quizzes/${quizId}/prepare-publish/overall`,
      );

      // FIX: Properly map nested response structure with group assignment
      const mapped = response.data.map((sub) => ({
        _id: sub._id,
        quizId: sub.quizId,
        userId: sub.userId?._id,
        score: sub.score,
        totalQuestions: sub.totalQuestions,
        timeTaken: sub.timeTaken,
        submittedAt: sub.submittedAt,
        studentName: sub.userId?.profile?.studentName || "Unknown",
        schoolName: sub.userId?.profile?.schoolName || "Unknown",
        className: sub.userId?.profile?.className || "Unknown",
        rollNumber: sub.userId?.profile?.rollNumber || "",
        group: getGroupByClass(sub.userId?.profile?.className), // Assign group
      }));

      setCandidates(mapped);
      setSelectedWinners(mapped.slice(0, topCount));
      setError("");
    } catch (err) {
      console.error("Error preparing results:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "ফলাফল প্রস্তুতি ব্যর্থ হয়েছে";
      setError(errorMsg);
      Toast.error(errorMsg);
    } finally {
      setPreparing(false);
    }
  };

  const handleRemoveCandidate = (id) => {
    setSelectedWinners(selectedWinners.filter((c) => c._id !== id));
  };

  const handleTopCountChange = (e) => {
    const newCount = parseInt(e.target.value) || 10;
    const maxCount = candidates.filter((c) =>
      selectedGroup === "সকল" ? true : c.group === selectedGroup,
    ).length;
    const validCount = Math.min(Math.max(newCount, 1), maxCount);
    setTopCount(validCount);
  };

  const handlePublish = async () => {
    if (selectedWinners.length === 0) {
      Toast.error("অন্তত একজন বিজয়ী নির্বাচন করুন");
      return;
    }

    try {
      setLoading(true);

      // VERSION 2: Format data for new backend endpoint with full winner info
      const topWinners = selectedWinners.map((winner) => ({
        userId: winner.userId,
        score: winner.score,
        // Include profile data for better display in results
        studentName: winner.studentName,
        schoolName: winner.schoolName,
        className: winner.className,
        rollNumber: winner.rollNumber,
      }));

      console.log(
        "Publishing with topWinners:",
        topWinners,
        "Group:",
        selectedGroup,
      ); // Debug log

      const response = await axios.post(
        `/api/admin/quizzes/${quizId}/publish-results`,
        {
          topWinners,
          topCount: topWinners.length,
          group: selectedGroup, // Include group name
        },
      );

      Toast.success("ফলাফল সফলভাবে প্রকাশিত হয়েছে!");
      if (onPublished) {
        onPublished(response.data.result);
      }
      onClose();
    } catch (err) {
      console.error("Publish error:", err);
      Toast.error(err.response?.data?.message || "ফলাফল প্রকাশ ব্যর্থ");
    } finally {
      setLoading(false);
    }
  };

  const maxCountForGroup = candidates.filter((c) =>
    selectedGroup === "সকল" ? true : c.group === selectedGroup,
  ).length;

  return (
    <form
      method="dialog"
      className="modal-box w-full max-w-2xl bg-white text-gray-800"
    >
      <button
        type="button"
        onClick={onClose}
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      >
        ✕
      </button>

      <div className="flex items-center gap-3 mb-6">
        <FaMedal className="text-3xl text-yellow-500" />
        <h3 className="text-2xl font-bold">{quizTitle} - ফলাফল প্রকাশ করুন</h3>
      </div>

      {/* VERSION 2: Info about publishing mode */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>গ্রুপ ভিত্তিক ফলাফল:</strong> প্রথমে একটি গ্রুপ নির্বাচন করুন,
          তারপর সেই গ্রুপ থেকে বিজয়ী নির্বাচন করুন।
        </p>
      </div>

      {/* Group Selector - Tabs */}
      {!preparing && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <label className="font-semibold text-purple-900 block mb-3">
            গ্রুপ নির্বাচন করুন:
          </label>
          <div className="tabs tabs-bordered gap-1 flex flex-wrap">
            {Object.entries(GROUPS).map(([groupName, groupData]) => (
              <a
                key={groupName}
                onClick={() => {
                  setSelectedGroup(groupName);
                  setTopCount(10);
                }}
                className={`tab tab-lg ${
                  selectedGroup === groupName
                    ? "tab-active bg-purple-600 text-white"
                    : "bg-white text-purple-900 hover:bg-purple-100"
                }`}
              >
                {groupData.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top Count Selector */}
      {!preparing && candidates.length > 0 && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-4">
          <label className="font-semibold text-purple-900">
            শীর্ষ বিজয়ী সংখ্যা:
          </label>
          <input
            type="number"
            min="1"
            max={maxCountForGroup}
            value={topCount}
            onChange={handleTopCountChange}
            className="input input-sm input-bordered w-20 text-center"
          />
          <span className="text-sm text-purple-700">
            (সর্বোচ্চ: {maxCountForGroup})
          </span>
        </div>
      )}

      {/* Loading State */}
      {preparing && (
        <div className="flex justify-center py-20">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !preparing && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Candidates List */}
      {!preparing && selectedWinners.length > 0 && (
        <div className="max-h-96 overflow-y-auto mb-6 border rounded-lg">
          <table className="table table-xs w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th>#</th>
                <th>নাম</th>
                <th>স্কুল/প্রতিষ্ঠান</th>
                <th>শ্রেণী</th>
                <th>স্কোর</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {selectedWinners.map((winner, idx) => (
                <tr key={winner._id} className="hover:bg-gray-50">
                  <td className="font-bold">
                    {idx === 0 && "🥇"}
                    {idx === 1 && "🥈"}
                    {idx === 2 && "🥉"}
                    {idx > 2 && `${idx + 1}`}
                  </td>
                  <td>{winner.studentName}</td>
                  <td className="text-xs truncate">{winner.schoolName}</td>
                  <td>{winner.className}</td>
                  <td className="font-bold text-blue-600">{winner.score}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveCandidate(winner._id)}
                      className="btn btn-xs btn-ghost text-red-600 hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-blue-50 border-t text-sm text-gray-700">
            <p>
              <strong>নির্বাচিত বিজয়ী ({selectedGroup}):</strong>{" "}
              {selectedWinners.length}
            </p>
            <p className="mt-2">
              💡 পরামর্শ: প্রতি গ্রুপে ৩-৫ জন বিজয়ী নির্বাচন করুন।
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!preparing && selectedWinners.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>
            {selectedGroup === "সকল"
              ? "কোনো প্রার্থী পাওয়া যায়নি"
              : `${GROUPS[selectedGroup].label} এ কোনো প্রার্থী পাওয়া যায়নি`}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="modal-action mt-6">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost"
          disabled={loading}
        >
          বাতিল করুন
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={loading || selectedWinners.length === 0 || preparing}
          className="btn btn-primary gap-2"
        >
          {loading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {selectedGroup} গ্রুপের ফলাফল প্রকাশ করুন
        </button>
      </div>
    </form>
  );
};

export default PublishResultModal;
