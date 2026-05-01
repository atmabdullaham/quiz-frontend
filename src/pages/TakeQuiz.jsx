import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCircleCheck, FaClock } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";

const TakeQuiz = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/quizzes/${id}`);
      setTimeLeft(data.timeLimit * 60); // Convert to seconds
      return data;
    },
    retry: false,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to load quiz");
      navigate("/quizzes");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (submissionData) => {
      const { data } = await axios.post(
        `/api/quizzes/${id}/submit`,
        submissionData,
      );
      return data;
    },
    onSuccess: (data) => {
      // VERSION 2: Handle answer locking
      if (data.answersLocked) {
        toast.success(
          data.message ||
            "Quiz submitted! Answers are locked until results are published.",
        );
      } else {
        toast.success("Quiz submitted successfully!");
      }

      navigate(`/quiz/${id}/result`);
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Failed to submit quiz";
      toast.error(errorMsg);
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Are you sure you want to submit the quiz?",
      );
      if (!confirmed) return;
    }

    // Get student info from session storage for submission (profile already updated in PreQuizForm)
    const studentInfoStr = sessionStorage.getItem("studentInfo");
    let profileData = null;

    if (studentInfoStr) {
      const studentInfo = JSON.parse(studentInfoStr);
      profileData = {
        studentName: studentInfo.studentName,
        schoolName: studentInfo.schoolName,
        className: studentInfo.className,
        rollNumber: studentInfo.rollNumber || "",
        mobileNumber: studentInfo.mobileNumber || "",
        address: studentInfo.address || "",
      };
    }

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const answersArray = quiz.questions.map((_, index) => ({
      selectedOption: answers[index] !== undefined ? answers[index] : -1,
    }));

    // Submit quiz with profileData (profile was already updated in PreQuizForm)
    submitMutation.mutate({
      answers: answersArray,
      timeTaken,
      profileData: profileData || {},
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-white font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const questionsPerPage = 1; // One question per screen for better mobile experience
  const totalPages = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[currentPage];
  const globalIndex = currentPage;

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const isAnswered = answers[globalIndex] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-32">
      {/* Header - Sticky on all devices */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Title */}
            <div className="md:col-span-1">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent line-clamp-1">
                {quiz?.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Question {globalIndex + 1} of {totalQuestions}
              </p>
            </div>

            {/* Timer and Progress */}
            <div className="flex justify-center gap-3 md:gap-6">
              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg md:text-xl font-mono ${
                  timeLeft < 60
                    ? "bg-red-100 text-red-700"
                    : timeLeft < 300
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <FaClock className="text-lg" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Answered Count */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">
                <span>{answeredCount}</span>
              </div>
            </div>

            {/* Question Counter */}
            <div className="hidden md:flex justify-end">
              <div className="text-right">
                <p className="text-sm text-slate-600">Progress</p>
                <p className="text-xl font-bold text-slate-900">
                  {answeredCount}/{totalQuestions} answered
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto md:px-4 md:py-8">
        {currentQuestion && (
          <div className="max-w-3xl mx-auto">
            {/* Question Card */}
            <div className="bg-white md:rounded-2xl  p-6 md:p-8 mb-8 transform transition-transform duration-300">
              {/* Question Number and Answered Badge */}
              <div className="flex items-start justify-between gap-4 mb-2 md:mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg md:text-xl flex items-center justify-center shadow-lg">
                      {globalIndex + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Question
                    </p>
                  </div>
                </div>
                {isAnswered && (
                  <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex-shrink-0">
                    <FaCircleCheck className="text-base" />
                    <span>Answered</span>
                  </div>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3 md:space-y-4">
                {currentQuestion.options.map((option, oIndex) => {
                  const isSelected = answers[globalIndex] === oIndex;
                  return (
                    <div key={oIndex} className="relative">
                      <input
                        type="radio"
                        name={`question-${globalIndex}`}
                        id={`option-${globalIndex}-${oIndex}`}
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleAnswer(globalIndex, oIndex)}
                        aria-label={`Option ${oIndex + 1}: ${option}`}
                      />
                      <label
                        htmlFor={`option-${globalIndex}-${oIndex}`}
                        className="block  peer-checked:ring-offset-2 peer-checked:ring-purple-500 cursor-pointer"
                      >
                        <div
                          className={`p-4 md:p-6 rounded-xl border-2 transition-all duration-200 transform] ${
                            isSelected
                              ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-purple-500 shadow-lg"
                              : "bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-indigo-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Radio Button */}
                            <div
                              className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-purple-600"
                                  : "border-slate-300 group-hover:border-purple-400"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>

                            {/* Option Text */}
                            <span
                              className={`text-base md:text-lg font-medium transition-colors flex-grow ${
                                isSelected ? "text-slate-900" : "text-slate-700"
                              }`}
                            >
                              {option}
                            </span>

                            {/* Selection Indicator */}
                            {isSelected && (
                              <FaCircleCheck className="text-purple-600 text-lg md:text-xl flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation and Action Buttons */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 sticky bottom-4 md:bottom-6 border-t-4 border-gradient-to-r from-indigo-500 to-purple-600">
              <div className="flex flex-row gap-4 items-center justify-between">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                  className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base"
                >
                  ← Previous
                </button>

                {/* Question Counter for Mobile */}
                {/* <div className="md:hidden text-center">
                  <p className="text-sm text-slate-600">
                    {answeredCount}/{totalQuestions} answered
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {currentPage + 1}/{totalQuestions}
                  </p>
                </div> */}

                {/* Page Counter - Hidden on Mobile */}
                <div className=" md:block text-center">
                  <p className="text-sm text-slate-600 font-medium">
                    Question {currentPage + 1} of {totalQuestions}
                  </p>
                </div>

                {/* Next or Submit Button */}
                {currentPage < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white  hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm md:text-base"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={submitMutation.isPending}
                    className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FaCircleCheck className="text-lg" />
                        <span>Submit Quiz</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Submit Info */}
              {currentPage === totalQuestions - 1 && (
                <div className="mt-4 p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-xs md:text-sm text-amber-900">
                  ⚠️ This is the last question. Make sure to submit your
                  answers!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TakeQuiz;
