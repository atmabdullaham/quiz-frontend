import { useEffect, useState } from "react";
import Toast from "react-hot-toast";
import { FaCheckCircle, FaMedal } from "react-icons/fa";
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

// Helper function to format time taken (in seconds to readable format)
const formatTimeTaken = (seconds) => {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}মি ${secs}সে`;
  }
  return `${secs}সে`;
};

const GROUP_CONFIG = {
  স্বপ্নিল: {
    name: "১ম গ্রুপ - স্বপ্নিল (৪র্থ-৭ম শ্রেণি)",
    showCount: 5,
    requiredCount: 2,
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
    buttonColor: "btn-primary",
  },
  প্রত্যয়: {
    name: "২য় গ্রুপ - প্রত্যয় (০৮ম-০১০ম শ্রেণি)",
    showCount: 5,
    requiredCount: 2,
    color: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-900",
    buttonColor: "btn-success",
  },
  অগ্রপথিক: {
    name: "৩য় গ্রুপ - অগ্রপথিক (১১শ-১২শ)",
    showCount: 3,
    requiredCount: 1,
    color: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-900",
    buttonColor: "btn-warning",
  },
};

const PublishResultModal = ({ quizId, quizTitle, onClose, onPublished }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(true);
  const [error, setError] = useState("");

  // State for each group's selected winners
  const [selectedWinnersSwapnil, setSelectedWinnersSwapnil] = useState([]);
  const [selectedWinnersProttoy, setSelectedWinnersProttoy] = useState([]);
  const [selectedWinnersOgropothik, setSelectedWinnersOgropothik] = useState(
    [],
  );

  useEffect(() => {
    prepareResults();
  }, [quizId]);

  const prepareResults = async () => {
    try {
      setPreparing(true);
      setError("");

      const response = await axios.get(
        `/api/admin/quizzes/${quizId}/prepare-publish/overall`,
      );

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
        address: sub.userId?.profile?.address || "—",
        phoneNumber: sub.userId?.profile?.mobileNumber || "—",
        schoolName: sub.userId?.profile?.schoolName || "—",
        group: getGroupByClass(sub.userId?.profile?.className),
      }));

      setCandidates(mapped);
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

  const getTopCandidatesForGroup = (groupName) => {
    return candidates
      .filter((c) => c.group === groupName)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken; // Tiebreaker: less time is better
      })
      .slice(0, GROUP_CONFIG[groupName].showCount);
  };

  // Get required count for a group (adjusted if fewer candidates than required)
  const getRequiredCountForGroup = (groupName) => {
    const candidates = getTopCandidatesForGroup(groupName);
    const configured = GROUP_CONFIG[groupName].requiredCount;
    // If fewer candidates than required, use candidate count instead
    return Math.min(configured, candidates.length);
  };

  // Check if a group is "ready" (0 candidates = auto-ready, or has required winners)
  const isGroupReady = (groupName) => {
    const candidates = getTopCandidatesForGroup(groupName);
    const required = getRequiredCountForGroup(groupName);
    let selectedWinners;

    if (groupName === "স্বপ্নিল") selectedWinners = selectedWinnersSwapnil;
    else if (groupName === "প্রত্যয়") selectedWinners = selectedWinnersProttoy;
    else selectedWinners = selectedWinnersOgropothik;

    // If no candidates, group is auto-ready
    if (candidates.length === 0) return true;
    // Otherwise, must have required count
    return selectedWinners.length === required;
  };

  // Add candidate to selected winners
  const addCandidate = (groupName, candidate) => {
    const required = getRequiredCountForGroup(groupName);
    let currentSelected;
    let setFunction;

    if (groupName === "স্বপ্নিল") {
      currentSelected = selectedWinnersSwapnil;
      setFunction = setSelectedWinnersSwapnil;
    } else if (groupName === "প্রত্যয়") {
      currentSelected = selectedWinnersProttoy;
      setFunction = setSelectedWinnersProttoy;
    } else if (groupName === "অগ্রপথিক") {
      currentSelected = selectedWinnersOgropothik;
      setFunction = setSelectedWinnersOgropothik;
    }

    if (currentSelected.length >= required) {
      Toast.error(
        `${groupName} এ সর্বোচ্চ ${required} জন নির্বাচন করতে পারবেন`,
      );
      return;
    }
    if (currentSelected.find((c) => c._id === candidate._id)) {
      Toast.error("এই শিক্ষার্থী ইতিমধ্যে নির্বাচিত আছে");
      return;
    }
    setFunction([...currentSelected, candidate]);
  };

  // Remove candidate from selected winners
  const removeCandidate = (groupName, candidateId) => {
    if (groupName === "স্বপ্নিল") {
      setSelectedWinnersSwapnil(
        selectedWinnersSwapnil.filter((c) => c._id !== candidateId),
      );
    } else if (groupName === "প্রত্যয়") {
      setSelectedWinnersProttoy(
        selectedWinnersProttoy.filter((c) => c._id !== candidateId),
      );
    } else if (groupName === "অগ্রপথিক") {
      setSelectedWinnersOgropothik(
        selectedWinnersOgropothik.filter((c) => c._id !== candidateId),
      );
    }
  };

  const handlePublish = async () => {
    // Button is only enabled if all validations passed, so we can publish directly
    try {
      setLoading(true);

      // Format data for all groups
      const formatWinners = (winners) =>
        winners.map((w) => ({
          userId: w.userId,
          score: w.score,
          studentName: w.studentName,
          schoolName: w.schoolName,
          className: w.className,
          rollNumber: w.rollNumber,
        }));

      const payload = {
        results: {
          স্বপ্নিল: {
            group: "স্বপ্নিল",
            topWinners: formatWinners(selectedWinnersSwapnil),
          },
          প্রত্যয়: {
            group: "প্রত্যय়",
            topWinners: formatWinners(selectedWinnersProttoy),
          },
          অগ্রপথিক: {
            group: "অগ্রপথিক",
            topWinners: formatWinners(selectedWinnersOgropothik),
          },
        },
      };

      console.log("Publishing all groups:", payload);

      const response = await axios.post(
        `/api/admin/quizzes/${quizId}/publish-results`,
        payload,
      );

      Toast.success("সকল গ্রুপের ফলাফল সফলভাবে প্রকাশিত হয়েছে!");
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

  const isAllGroupsReady =
    isGroupReady("স্বপ্নিল") &&
    isGroupReady("প্রত্যয়") &&
    isGroupReady("অগ্রপথিক") &&
    (selectedWinnersSwapnil.length > 0 ||
      selectedWinnersProttoy.length > 0 ||
      selectedWinnersOgropothik.length > 0);

  return (
    <form
      method="dialog"
      className="modal-box w-full max-w-4xl bg-white text-gray-800 max-h-[90vh] overflow-y-auto"
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
        <h3 className="text-2xl font-bold">{quizTitle} - সকল গ্রুপের ফলাফল</h3>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>নির্দেশনা:</strong> প্রতিটি গ্রুপ থেকে প্রয়োজনীয় সংখ্যক
          বিজয়ী নির্বাচন করুন। সব গ্রুপের নির্বাচন সম্পন্ন হলে "সকল ফলাফল
          প্রকাশ করুন" বাটন ক্লিক করুন।
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

      {/* All Groups Sections */}
      {!preparing && (
        <div className="space-y-6">
          {Object.entries(GROUP_CONFIG).map(([groupName, config]) => {
            const topCandidates = getTopCandidatesForGroup(groupName);
            let selectedWinners;
            if (groupName === "স্বপ্নিল")
              selectedWinners = selectedWinnersSwapnil;
            else if (groupName === "প্রত্যয়")
              selectedWinners = selectedWinnersProttoy;
            else selectedWinners = selectedWinnersOgropothik;

            const hasNoCandidates = topCandidates.length === 0;
            const requiredCount = getRequiredCountForGroup(groupName);
            const isReady = isGroupReady(groupName);

            return (
              <div
                key={groupName}
                className={`p-4 border rounded-lg ${config.color} ${config.borderColor} ${
                  hasNoCandidates ? "opacity-75" : ""
                }`}
              >
                {/* Group Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className={`text-lg font-bold ${config.textColor}`}>
                      {config.name}
                    </h4>
                    <p className={`text-sm ${config.textColor}`}>
                      {hasNoCandidates ? (
                        <span className="font-semibold">
                          এই গ্রুপে কোনো অংশগ্রহণকারী নেই - স্বয়ংক্রিয়ভাবে
                          এড়িয়ে যাবে
                        </span>
                      ) : (
                        <span>
                          শীর্ষ {config.showCount} প্রার্থী থেকে{" "}
                          {requiredCount === config.requiredCount ? (
                            <span>{config.requiredCount} জন</span>
                          ) : (
                            <span className="font-bold text-orange-600">
                              {requiredCount} জন নির্বাচন করুন
                              <span className="text-xs ml-1">
                                (শুধুমাত্র {topCandidates.length} জন উপলব্ধ)
                              </span>
                            </span>
                          )}{" "}
                          নির্বাচন করুন
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {hasNoCandidates ? (
                      <div>
                        <div
                          className={`text-xl font-bold ${config.textColor}`}
                        >
                          N/A
                        </div>
                        <FaCheckCircle className="text-orange-500 text-2xl mt-1" />
                      </div>
                    ) : (
                      <div>
                        <div
                          className={`text-2xl font-bold ${config.textColor}`}
                        >
                          {selectedWinners.length}/{requiredCount}
                        </div>
                        {isReady && (
                          <FaCheckCircle className="text-green-600 text-2xl mt-1" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidates Table */}
                {topCandidates.length > 0 ? (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y-2 divide-gray-200">
                      <thead className="ltr:text-left rtl:text-right bg-white">
                        <tr className="*:font-semibold *:text-gray-700 *:text-sm *:px-3 *:py-2">
                          <th className="whitespace-nowrap">অবস্থান</th>
                          <th className="whitespace-nowrap">শিক্ষার্থীর নাম</th>
                          <th className="whitespace-nowrap">স্কোর</th>
                          <th className="whitespace-nowrap">সময়</th>
                          <th className="whitespace-nowrap">প্রতিষ্ঠান</th>
                          <th className="whitespace-nowrap">শ্রেণি</th>
                          <th className="whitespace-nowrap">ফোন</th>
                          <th className="whitespace-nowrap">ঠিকানা</th>
                          <th className="whitespace-nowrap text-center">
                            নির্বাচন
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
                        {topCandidates.map((candidate, idx) => {
                          const isSelected = selectedWinners.find(
                            (w) => w._id === candidate._id,
                          );
                          const medals = ["🥇", "🥈", "🥉"];
                          return (
                            <tr
                              key={candidate._id}
                              className={`*:text-gray-900 *:text-sm *:px-3 *:py-2 transition-colors ${
                                isSelected ? "bg-green-50" : ""
                              }`}
                            >
                              <td className="font-bold text-lg text-center whitespace-nowrap">
                                {medals[idx] || `#${idx + 1}`}
                              </td>
                              <td className="font-semibold whitespace-nowrap">
                                {candidate.studentName}
                              </td>
                              <td className="font-bold text-blue-600 whitespace-nowrap">
                                {candidate.score}
                              </td>
                              <td className="whitespace-nowrap text-xs bg-blue-50 rounded px-2 py-1">
                                {formatTimeTaken(candidate.timeTaken)}
                              </td>
                              <td className="whitespace-nowrap">
                                {candidate.schoolName}
                              </td>
                              <td className="whitespace-nowrap">
                                {candidate.className}
                              </td>
                              <td className="text-xs text-gray-600 whitespace-nowrap">
                                {candidate.phoneNumber}
                              </td>
                              <td
                                className="text-xs text-gray-600 whitespace-nowrap max-w-xs truncate"
                                title={candidate.address}
                              >
                                {candidate.address}
                              </td>
                              <td className="text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      removeCandidate(groupName, candidate._id);
                                    } else {
                                      addCandidate(groupName, candidate);
                                    }
                                  }}
                                  disabled={loading}
                                  className={`btn btn-xs ${
                                    isSelected
                                      ? "btn-error"
                                      : config.buttonColor
                                  }`}
                                >
                                  {isSelected ? "❌" : "✓"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p className="font-semibold">এই গ্রুপে অংশগ্রহণকারী নেই</p>
                    <p className="text-sm mt-1">
                      ফলাফল প্রকাশের সময় এই গ্রুপ বাদ দেওয়া হবে
                    </p>
                  </div>
                )}

                {/* Selected Winners List */}
                {selectedWinners.length > 0 && (
                  <div className="bg-white p-3 rounded border-t mt-4">
                    <p className="text-sm font-semibold mb-2">
                      নির্বাচিত ({selectedWinners.length}/{requiredCount}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWinners.map((winner, idx) => (
                        <div
                          key={winner._id}
                          className="bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {idx === 0 && "🥇"}
                          {idx === 1 && "🥈"}
                          {idx === 2 && "🥉"}
                          {winner.studentName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="modal-action mt-8">
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
          disabled={loading || !isAllGroupsReady || preparing}
          className="btn btn-primary gap-2"
        >
          {loading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {isAllGroupsReady
            ? "সকল ফলাফল প্রকাশ করুন ✓"
            : "সকল গ্রুপ পূর্ণ করুন"}
        </button>
      </div>
    </form>
  );
};

export default PublishResultModal;
