import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import axios from "../utils/axios";

const ResultEditModal = ({ result, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    publishType: result.publishType,
    winners: result.winners || [],
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await axios.post(
        `/api/admin/quizzes/${result.quizId._id}/publish-results`,
        data,
      );
    },
    onSuccess: () => {
      toast.success("ফলাফল সফলভাবে আপডেট হয়েছে");
      onSaved();
    },
    onError: () => {
      toast.error("ফলাফল আপডেট করতে ব্যর্থ");
    },
  });

  const handleWinnerChange = (idx, field, value) => {
    const updated = [...formData.winners];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, winners: updated });
  };

  const handleRemoveWinner = (idx) => {
    setFormData({
      ...formData,
      winners: formData.winners.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.winners.length === 0) {
      toast.error("অন্তত একজন বিজয়ী যোগ করুন");
      return;
    }
    updateMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaEdit className="text-blue-600" />
          ফলাফল সম্পাদনা করুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quiz Title */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">কুইজ</p>
            <p className="text-lg font-bold text-gray-800">
              {result.quizId?.title}
            </p>
          </div>

          {/* Publish Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              ফলাফলের ধরন
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.publishType}
              onChange={(e) =>
                setFormData({ ...formData, publishType: e.target.value })
              }
              disabled
            >
              <option value="classwise">শ্রেণী অনুযায়ী</option>
              <option value="overall">সর্বোচ্চ স্কোর</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              ধরন পরিবর্তন করতে পুনরায় প্রকাশ করুন
            </p>
          </div>

          {/* Winners List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">বিজয়ীরা</h3>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {formData.winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg border-gray-200 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-700">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWinner(idx)}
                      className="btn btn-sm btn-error"
                    >
                      সরান
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="নাম"
                      className="input input-bordered input-sm"
                      value={winner.studentName}
                      onChange={(e) =>
                        handleWinnerChange(idx, "studentName", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="রোল"
                      className="input input-bordered input-sm"
                      value={winner.rollNumber || ""}
                      onChange={(e) =>
                        handleWinnerChange(idx, "rollNumber", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="মাদ্রাসা/স্কুল"
                      className="input input-bordered input-sm"
                      value={winner.schoolName}
                      onChange={(e) =>
                        handleWinnerChange(idx, "schoolName", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="শ্রেণী"
                      className="input input-bordered input-sm"
                      value={winner.className}
                      onChange={(e) =>
                        handleWinnerChange(idx, "className", e.target.value)
                      }
                    />
                  </div>

                  <input
                    type="number"
                    placeholder="স্কোর"
                    className="input input-bordered input-sm w-full"
                    value={winner.score || 0}
                    onChange={(e) =>
                      handleWinnerChange(idx, "score", parseInt(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={updateMutation.isLoading}
            >
              আপডেট করুন
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1"
              disabled={updateMutation.isLoading}
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultEditModal;
