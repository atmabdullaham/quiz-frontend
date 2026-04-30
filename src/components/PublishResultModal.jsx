import { useEffect, useState } from "react";
import Toast from "react-hot-toast";
import { FaMedal, FaTrash } from "react-icons/fa";
import axios from "../utils/axios";

const PublishResultModal = ({ quizId, quizTitle, onClose, onPublished }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    prepareResults();
  }, [quizId]);

  // VERSION 2: Simplified - no more publishType
  const prepareResults = async () => {
    try {
      setPreparing(true);
      setError("");

      // Get all submissions for the quiz
      const response = await axios.get(
        `/api/admin/quizzes/${quizId}/prepare-publish/overall`,
      );

      // FIX: Properly map nested response structure
      const mapped = response.data.map((sub) => ({
        _id: sub._id,
        quizId: sub.quizId,
        userId: sub.userId?._id, // Extract ID from nested object
        score: sub.score,
        totalQuestions: sub.totalQuestions,
        timeTaken: sub.timeTaken,
        submittedAt: sub.submittedAt,
        // Profile data from nested userId object
        studentName: sub.userId?.profile?.studentName || "Unknown",
        schoolName: sub.userId?.profile?.schoolName || "Unknown",
        className: sub.userId?.profile?.className || "Unknown",
        rollNumber: sub.userId?.profile?.rollNumber || "",
      }));
      setCandidates(mapped.slice(0, 15)); // Top 15 candidates
      setSelectedWinners(mapped.slice(0, 10)); // Default top 10 winners
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

  const handlePublish = async () => {
    if (selectedWinners.length === 0) {
      Toast.error("অন্তত একজন বিজয়ী নির্বাচন করুন");
      return;
    }

    try {
      setLoading(true);

      // VERSION 2: Format data for new backend endpoint
      // userId is already a string from the mapping, so just pass it directly
      const topWinners = selectedWinners.map((winner) => ({
        userId: winner.userId, // Already a string from prepareResults mapping
        score: winner.score,
      }));

      console.log("Publishing with topWinners:", topWinners); // Debug log

      const response = await axios.post(
        `/api/admin/quizzes/${quizId}/publish-results`,
        {
          topWinners,
          topCount: topWinners.length,
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
          <strong>V2 পদ্ধতি:</strong> সর্বোচ্চ স্কোর অনুযায়ী বিজয়ী নির্বাচন
          করুন। নির্বাচিত প্রতিটি বিজয়ীর উত্তর আনলক করা হবে।
        </p>
      </div>

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
              <strong>মোট বিজয়ী:</strong> {selectedWinners.length}
            </p>
            <p className="mt-2">
              💡 পরামর্শ: শীর্ষ 3-5 জন বিজয়ী নির্বাচন করুন।
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!preparing && selectedWinners.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>কোনো প্রার্থী পাওয়া যায়নি</p>
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
          ফলাফল প্রকাশ করুন
        </button>
      </div>
    </form>
  );
};

export default PublishResultModal;
