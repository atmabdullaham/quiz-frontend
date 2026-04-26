import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import {
  datetimeLocalToUTC,
  utcToDatetimeLocal,
} from "../../utils/timezoneConverter";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  });

  const { data: loadedQuiz, isLoading } = useQuery({
    queryKey: ["admin-quiz", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/quizzes`);
      const found = data.find((q) => q._id === id);
      if (!found) throw new Error("Quiz not found");
      return found;
    },
  });

  useEffect(() => {
    if (loadedQuiz) {
      // Format dates for datetime-local input
      // Convert UTC from database to Bangladesh time for display in form
      const formattedQuiz = {
        ...loadedQuiz,
        startDate: loadedQuiz.startDate
          ? utcToDatetimeLocal(loadedQuiz.startDate)
          : "",
        endDate: loadedQuiz.endDate
          ? utcToDatetimeLocal(loadedQuiz.endDate)
          : "",
      };
      setQuiz(formattedQuiz);
    }
  }, [loadedQuiz]);

  const updateMutation = useMutation({
    mutationFn: async (quizData) => {
      // Convert Bangladesh time from form to UTC for database storage
      const convertedData = {
        ...quizData,
        startDate: quizData.startDate
          ? datetimeLocalToUTC(quizData.startDate)
          : null,
        endDate: quizData.endDate ? datetimeLocalToUTC(quizData.endDate) : null,
      };
      const { data } = await axios.put(
        `/api/admin/quizzes/${id}`,
        convertedData,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Quiz updated successfully!");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update quiz");
    },
  });

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (currentQuestion.options.some((opt) => !opt.trim())) {
      toast.error("All options must be filled");
      return;
    }

    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { ...currentQuestion }],
    });

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    });

    toast.success("Question added!");
  };

  const handleRemoveQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
    toast.success("Question removed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!quiz.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }
    if (quiz.questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    updateMutation.mutate(quiz);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Quiz</h1>
          <p className="text-gray-600">Update quiz details and questions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Quiz Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter quiz title"
                  className="input input-bordered w-full"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  placeholder="Enter quiz description"
                  className="textarea textarea-bordered h-24"
                  value={quiz.description || ""}
                  onChange={(e) =>
                    setQuiz({ ...quiz, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Time Limit (minutes) *
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered"
                    value={quiz.timeLimit}
                    onChange={(e) =>
                      setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status *</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={quiz.status}
                    onChange={(e) =>
                      setQuiz({ ...quiz, status: e.target.value })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Start Date & Time
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={quiz.startDate}
                    onChange={(e) =>
                      setQuiz({ ...quiz, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      End Date & Time
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={quiz.endDate}
                    onChange={(e) =>
                      setQuiz({ ...quiz, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add Question */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Add Question
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Question Text
                  </span>
                </label>
                <textarea
                  placeholder="Enter question text"
                  className="textarea textarea-bordered h-24"
                  value={currentQuestion.question}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      question: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <label className="label">
                  <span className="label-text font-semibold">
                    Options (Select the correct one)
                  </span>
                </label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="correctAnswer"
                      className="radio radio-primary"
                      checked={currentQuestion.correctAnswer === index}
                      onChange={() =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: index,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      className="input input-bordered flex-1"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="btn btn-primary gap-2"
              >
                <FaPlus />
                Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          {quiz.questions.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Questions ({quiz.questions.length})
              </h2>
              <div className="space-y-4">
                {quiz.questions.map((q, index) => (
                  <div key={index} className="question-card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 flex-1">
                        <div className="badge badge-primary">{index + 1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">
                            {q.question}
                          </p>
                          <div className="space-y-1">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`text-sm ${
                                  i === q.correctAnswer
                                    ? "text-green-600 font-semibold"
                                    : "text-gray-600"
                                }`}
                              >
                                {i === q.correctAnswer && "✓ "}
                                {opt}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Points: {q.points || 1}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="btn btn-sm btn-error gap-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gradient gap-2"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Update Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
