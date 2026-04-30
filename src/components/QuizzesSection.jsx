import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaChartBar, FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { formatBangladeshiDate } from "../utils/bangladeshiDate";
import { getQuizStatusBangladesh } from "../utils/timezoneConverter";
import PublishResultModal from "./PublishResultModal";

const QuizzesSection = () => {
  const queryClient = useQueryClient();
  const [selectedQuizForPublish, setSelectedQuizForPublish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (!isModalOpen && dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isModalOpen]);

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/quizzes");
      return data;
    },
    refetchInterval: 5000,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: async (quizId) => {
      await axios.delete(`/api/admin/quizzes/${quizId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-quizzes"]);
      toast.success("কুইজ সফলভাবে মুছে ফেলা হয়েছে");
    },
    onError: () => {
      toast.error("কুইজ মুছতে ব্যর্থ");
    },
  });

  const handleDelete = (quizId, quizTitle) => {
    if (window.confirm(`আপনি কি "${quizTitle}" মুছতে নিশ্চিত?`)) {
      deleteMutation.mutate(quizId);
    }
  };

  const getStatusBadge = (quiz) => {
    const status = getQuizStatusBangladesh(quiz);
    const badgeClass = `badge ${status.color}`;
    return <div className={badgeClass}>{status.text}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">সকল কুইজ</h2>
        <Link to="/admin/quiz/create" className="btn btn-primary gap-2">
          <FaPlus />
          নতুন কুইজ তৈরি করুন
        </Link>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-32 rounded-xl"></div>
          ))}
        </div>
      ) : quizzes?.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            কোনো কুইজ নেই
          </h3>
          <p className="text-gray-500 mb-6">
            শুরু করতে আপনার প্রথম কুইজ তৈরি করুন!
          </p>
          <Link to="/admin/quiz/create" className="btn btn-primary">
            <FaPlus className="mr-2" />
            কুইজ তৈরি করুন
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes?.map((quiz) => (
            <div
              key={quiz._id}
              className="glass-card p-6 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {quiz.title}
                    </h3>
                    {getStatusBadge(quiz)}
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {quiz.description || "বর্ণনা নেই"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📝 {quiz.questions?.length || 0} প্রশ্ন</span>
                    <span>⏱️ {quiz.timeLimit} মিনিট</span>
                    <span>👤 {quiz.createdBy?.name || "অজানা"}</span>
                    {quiz.startDate && (
                      <span>📅 {formatBangladeshiDate(quiz.startDate)}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap w-full lg:w-auto">
                  <button
                    onClick={() => {
                      setSelectedQuizForPublish(quiz);
                      setIsModalOpen(true);
                    }}
                    className="btn btn-sm btn-warning gap-2 flex-1 sm:flex-none"
                    title="ফলাফল প্রকাশ করুন"
                  >
                    <FaPlus className="text-xs" /> ফলাফল
                  </button>
                  <Link
                    to={`/admin/quiz/${quiz._id}/stats`}
                    className="btn btn-sm btn-info gap-2 flex-1 sm:flex-none"
                    title="পরিসংখ্যান দেখুন"
                  >
                    <FaChartBar />
                  </Link>
                  <Link
                    to={`/quiz/${quiz._id}/leaderboard`}
                    className="btn btn-sm btn-success gap-2 flex-1 sm:flex-none"
                    title="লিডারবোর্ড দেখুন"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/quiz/${quiz._id}/edit`}
                    className="btn btn-sm btn-primary gap-2 flex-1 sm:flex-none"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz._id, quiz.title)}
                    className="btn btn-sm btn-error gap-2 flex-1 sm:flex-none"
                    disabled={deleteMutation.isLoading}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Result Modal */}
      {selectedQuizForPublish && (
        <dialog ref={dialogRef} id="publish_result_modal" className="modal">
          <PublishResultModal
            quizId={selectedQuizForPublish._id}
            quizTitle={selectedQuizForPublish.title}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedQuizForPublish(null);
            }}
            onPublished={() => {
              queryClient.invalidateQueries(["admin-quizzes"]);
              setIsModalOpen(false);
              setSelectedQuizForPublish(null);
            }}
          />
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedQuizForPublish(null);
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default QuizzesSection;
