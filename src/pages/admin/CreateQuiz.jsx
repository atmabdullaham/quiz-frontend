import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFileAlt,
  FaPlus,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { datetimeLocalToUTC } from "../../utils/timezoneConverter";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic"); // basic, questions
  const [previewQuestion, setPreviewQuestion] = useState(null);

  const [quiz, setQuiz] = useState({
    title: "",
    subtitle: "",
    description: "",
    timeLimit: 30,
    status: "draft",
    startDate: "",
    endDate: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  });

  const createMutation = useMutation({
    mutationFn: async (quizData) => {
      const convertedData = {
        ...quizData,
        startDate: quizData.startDate
          ? datetimeLocalToUTC(quizData.startDate)
          : null,
        endDate: quizData.endDate ? datetimeLocalToUTC(quizData.endDate) : null,
      };
      const { data } = await axios.post("/api/admin/quizzes", convertedData);
      return data;
    },
    onSuccess: () => {
      toast.success("✅ Quiz created successfully!");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create quiz");
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

    toast.success("✅ Question added!");
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
    if (!quiz.subtitle.trim()) {
      toast.error("Quiz subtitle is required");
      return;
    }
    if (quiz.questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }
    if (quiz.status !== "draft" && (!quiz.startDate || !quiz.endDate)) {
      toast.error(
        "Start and end dates are required for scheduled/active quizzes",
      );
      return;
    }

    createMutation.mutate(quiz);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const calculateTotalPoints = () => {
    return quiz.questions.reduce((sum, q) => sum + q.points, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 md:py-12 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <MdQuiz className="text-3xl md:text-4xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">
                নতুন কুইজ তৈরি করুন
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                আকর্ষণীয় প্রশ্ন যোগ করে আপনার কুইজ ডিজাইন করুন
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-6 text-sm">
            <div className="flex-1">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${
                      ((quiz.questions.length > 0 ? 1 : 0) +
                        (quiz.title?.trim() ? 1 : 0)) *
                      50
                    }%`,
                  }}
                />
              </div>
            </div>
            <span className="text-white/90 font-semibold">
              {quiz.title?.trim() ? "✓ " : ""}
              {quiz.questions.length > 0
                ? `${quiz.questions.length} প্রশ্ন`
                : "প্রশ্ন যোগ করুন"}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 md:px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "basic"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <span className="hidden sm:inline">📋 </span>
            মৌলিক তথ্য
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 md:px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "questions"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <span className="hidden sm:inline">❓ </span>
            প্রশ্ন ({quiz.questions.length})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO TAB */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Quiz Title */}
              <div className="glass-card p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FaFileAlt className="text-indigo-600 text-xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    কুইজ শিরোনাম
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  একটি আকর্ষণীয় এবং স্পষ্ট শিরোনাম দিন যা ছাত্রদের আকৃষ্ট করবে
                </p>
                <input
                  type="text"
                  placeholder="যেমন: কোরআন শরীফ - জুজ আম্মা পরীক্ষা"
                  className="input input-bordered w-full text-base focus:input-primary"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {quiz.title.length}/100 অক্ষর
                </p>
              </div>

              {/* Quiz Subtitle */}
              <div className="glass-card p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FaFileAlt className="text-indigo-600 text-xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    সহায়ক শিরোনাম
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  একটি সংক্ষিপ্ত সাবটাইটেল বা ট্যাগলাইন যা কুইজকে সংজ্ঞায়িত করে
                </p>
                <input
                  type="text"
                  placeholder="যেমন: মধ্যবিত্ত দক্ষতা পরীক্ষা"
                  className="input input-bordered w-full text-base focus:input-primary"
                  value={quiz.subtitle}
                  onChange={(e) =>
                    setQuiz({ ...quiz, subtitle: e.target.value })
                  }
                  maxLength={80}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {quiz.subtitle.length}/80 অক্ষর
                </p>
              </div>

              {/* Description */}
              <div className="glass-card p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaFileAlt className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    বর্ণনা
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  কুইজের উদ্দেশ্য এবং নির্দেশনা লিখুন
                </p>
                <textarea
                  placeholder="এই কুইজ সম্পর্কে বিবরণ দিন..."
                  className="textarea textarea-bordered h-28 w-full focus:textarea-primary text-base"
                  value={quiz.description}
                  onChange={(e) =>
                    setQuiz({ ...quiz, description: e.target.value })
                  }
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {quiz.description.length}/500 অক্ষর
                </p>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time Limit */}
                <div className="glass-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaClock className="text-orange-600 text-xl" />
                    </div>
                    <h3 className="font-bold text-gray-800">সময় সীমা</h3>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    className="input input-bordered w-full text-base focus:input-primary"
                    value={quiz.timeLimit}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        timeLimit: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {quiz.timeLimit} মিনিট
                  </p>
                </div>

                {/* Status */}
                <div className="glass-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <h3 className="font-bold text-gray-800">অবস্থা</h3>
                  </div>
                  <select
                    className="select select-bordered w-full text-base focus:select-primary"
                    value={quiz.status}
                    onChange={(e) =>
                      setQuiz({ ...quiz, status: e.target.value })
                    }
                  >
                    <option value="draft">খসড়া (আপনি দেখতে পারবেন)</option>
                    <option value="scheduled">
                      সময়সূচী (নির্ধারিত সময়ে শুরু)
                    </option>
                    <option value="active">সক্রিয় (এখনই উপলব্ধ)</option>
                  </select>
                </div>
              </div>

              {/* Date/Time - Conditional */}
              {quiz.status !== "draft" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm md:text-base">
                      শুরু তারিখ এবং সময় *
                    </h3>
                    <input
                      type="datetime-local"
                      className="input input-bordered w-full text-base focus:input-primary"
                      value={quiz.startDate}
                      onChange={(e) =>
                        setQuiz({ ...quiz, startDate: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      বাংলাদেশ সময় অনুযায়ী নির্বাচন করুন
                    </p>
                  </div>

                  <div className="glass-card p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm md:text-base">
                      শেষ তারিখ এবং সময় *
                    </h3>
                    <input
                      type="datetime-local"
                      className="input input-bordered w-full text-base focus:input-primary"
                      value={quiz.endDate}
                      onChange={(e) =>
                        setQuiz({ ...quiz, endDate: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      শুরুর সময়ের পরে হতে হবে
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === "questions" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Add New Question Section */}
              <div className="glass-card p-6 md:p-8 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaPlus className="text-indigo-600" />
                  নতুন প্রশ্ন যোগ করুন
                </h2>

                <div className="space-y-5">
                  {/* Question Text */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm md:text-base">
                      প্রশ্ন লিখুন *
                    </label>
                    <textarea
                      placeholder="আপনার প্রশ্ন এখানে লিখুন..."
                      className="textarea textarea-bordered h-24 w-full focus:textarea-primary text-base"
                      value={currentQuestion.question}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          question: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-3 text-sm md:text-base">
                      বিকল্প সমূহ (সঠিক বিকল্প নির্বাচন করুন) *
                    </label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="flex-shrink-0">
                            <input
                              type="radio"
                              name="correctAnswer"
                              className="radio radio-primary w-5 h-5 cursor-pointer"
                              checked={currentQuestion.correctAnswer === index}
                              onChange={() =>
                                setCurrentQuestion({
                                  ...currentQuestion,
                                  correctAnswer: index,
                                })
                              }
                            />
                          </div>
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded font-bold text-xs text-gray-700 flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            type="text"
                            placeholder={`বিকল্প ${index + 1}`}
                            className="input input-bordered flex-1 text-base focus:input-primary"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm md:text-base">
                      পয়েন্ট *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="input input-bordered w-full md:w-40 text-base focus:input-primary"
                      value={currentQuestion.points}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          points: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn btn-primary w-full md:w-auto gap-2 mt-4"
                  >
                    <FaPlus />
                    প্রশ্ন যোগ করুন
                  </button>
                </div>
              </div>

              {/* Questions List */}
              {quiz.questions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      প্রশ্ন সমূহ ({quiz.questions.length})
                    </h2>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">মোট পয়েন্ট:</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {calculateTotalPoints()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {quiz.questions.map((q, index) => (
                      <div
                        key={index}
                        className="glass-card p-5 md:p-6 hover:shadow-lg transition-all group"
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="badge badge-lg badge-primary gap-1 text-base">
                              #{index + 1}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm md:text-base mb-3 line-clamp-2">
                              {q.question}
                            </p>

                            <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className={`text-sm flex items-center gap-2 ${
                                    i === q.correctAnswer
                                      ? "text-green-700 font-semibold bg-green-50 p-2 rounded"
                                      : "text-gray-600"
                                  }`}
                                >
                                  <span className="font-bold text-xs">
                                    {String.fromCharCode(65 + i)}.
                                  </span>
                                  <span className="line-clamp-1">{opt}</span>
                                  {i === q.correctAnswer && (
                                    <FaCheckCircle className="ml-auto text-green-600" />
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-4 text-xs text-gray-600">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                📌 {q.points} পয়েন্ট
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewQuestion(index)}
                              className="btn btn-sm btn-ghost gap-1"
                              title="প্রিভিউ"
                            >
                              <FaEye />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(index)}
                              className="btn btn-sm btn-error btn-outline"
                              title="মুছুন"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quiz.questions.length === 0 && (
                <div className="text-center py-12 glass-card">
                  <MdQuiz className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold text-lg mb-2">
                    এখনও কোনও প্রশ্ন নেই
                  </p>
                  <p className="text-gray-500 text-sm">
                    উপরে প্রশ্ন যোগ করে শুরু করুন
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="btn btn-outline w-full sm:w-auto"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              className="btn btn-gradient w-full sm:w-auto gap-2"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave />
                  কুইজ তৈরি করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
        }

        .btn-gradient {
          @apply bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0;
        }
      `}</style>
    </div>
  );
};

export default CreateQuiz;
