import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import axios from "../utils/axios";
import DetailedResultModal from "./DetailedResultModal";
import ResultEditModal from "./ResultEditModal";

const ResultsSection = () => {
  const queryClient = useQueryClient();
  const [editingResult, setEditingResult] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [detailedResult, setDetailedResult] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: results = [] } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const { data } = await axios.get("/api/published-results");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (resultId) => {
      // Note: We'll need to add a delete endpoint for published results in the backend
      // For now, using a placeholder - you'll need to implement this in the backend
      await axios.delete(`/api/admin/published-results/${resultId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-results"]);
      toast.success("ফলাফল সফলভাবে মুছে ফেলা হয়েছে");
    },
    onError: () => {
      toast.error("ফলাফল মুছতে ব্যর্থ");
    },
  });

  const handleEdit = (result) => {
    setEditingResult(result);
    setIsEditModalOpen(true);
  };

  const handleDetails = (result) => {
    setDetailedResult(result);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (resultId) => {
    if (window.confirm("আপনি কি এই ফলাফল মুছতে নিশ্চিত?")) {
      deleteMutation.mutate(resultId);
    }
  };

  const getLocationBadge = (location) => {
    const badges = {
      classwise: "badge-primary",
      overall: "badge-success",
    };
    const labels = {
      classwise: "শ্রেণী অনুযায়ী",
      overall: "সর্বোচ্চ স্কোর",
    };
    return (
      <span className={`badge ${badges[location] || "badge-neutral"}`}>
        {labels[location] || location}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">প্রকাশিত ফলাফল</h2>

      {/* Results Table */}
      <div className="glass-card overflow-x-auto">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              এখনো কোনো ফলাফল প্রকাশ করা হয়নি
            </p>
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-gray-800 font-bold">কুইজ</th>
                <th className="text-gray-800 font-bold">ধরন</th>
                <th className="text-gray-800 font-bold">বিজয়ীরা</th>
                <th className="text-gray-800 font-bold">প্রকাশিত</th>
                <th className="text-gray-800 font-bold">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td>
                    <span className="font-semibold text-gray-800">
                      {result.quizId?.title || "অজানা"}
                    </span>
                  </td>
                  <td>{getLocationBadge(result.publishType)}</td>
                  <td>
                    <span className="badge badge-info">
                      {result.winners?.length || 0} জন
                    </span>
                  </td>
                  <td className="text-sm text-gray-600">
                    {new Date(result.publishedAt).toLocaleDateString("bn-BD")}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDetails(result)}
                        className="btn btn-sm btn-ghost gap-1 text-indigo-600"
                        title="বিস্তারিত দেখুন"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(result)}
                        className="btn btn-sm btn-ghost gap-1 text-blue-600"
                        disabled={deleteMutation.isLoading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="btn btn-sm btn-ghost gap-1 text-red-600"
                        disabled={deleteMutation.isLoading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingResult && (
        <ResultEditModal
          result={editingResult}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingResult(null);
          }}
          onSaved={() => {
            queryClient.invalidateQueries(["admin-results"]);
            setIsEditModalOpen(false);
            setEditingResult(null);
          }}
        />
      )}

      {/* Details Modal */}
      {isDetailModalOpen && detailedResult && (
        <DetailedResultModal
          result={detailedResult}
          onClose={() => {
            setIsDetailModalOpen(false);
            setDetailedResult(null);
          }}
        />
      )}
    </div>
  );
};

export default ResultsSection;
