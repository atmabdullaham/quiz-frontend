import { useEffect, useState, useCallback } from "react";
import { FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "../utils/axios";

const StudentsSection = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const itemsPerPage = 20;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(selectedClass && { className: selectedClass }),
      });

      const { data } = await axios.get(`/api/admin/students?${params}`);
      setStudents(data.students);
      setClasses(data.classes);
      setTotalPages(data.totalPages);
      setTotalStudents(data.totalStudents);
    } catch (err) {
      setError("শিক্ষার্থী তথ্য পেতে ব্যর্থ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedClass]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDeleteStudent = async (id, studentName) => {
    if (!window.confirm(`${studentName} কে ডিলিট করতে নিশ্চিত?`)) {
      return;
    }

    try {
      setDeleting(id);
      await axios.delete(`/api/admin/students/${id}`);
      toast.success("শিক্ষার্থী সফলভাবে ডিলিট হয়েছে");

      // Refetch students
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchStudents();
      }
    } catch (err) {
      toast.error("ডিলিট ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  // Handle class filter change
  const handleClassFilter = (className) => {
    setSelectedClass(className);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              শিক্ষার্থী ব্যবস্থাপনা
            </h2>
            <p className="text-gray-600 mt-1">
              মোট শিক্ষার্থী:{" "}
              <span className="font-bold text-primary">{totalStudents}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaFilter className="text-primary" />
          <h3 className="text-lg font-bold text-gray-800">ফিল্টার করুন</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              শ্রেণি দিয়ে ফিল্টার করুন
            </label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassFilter(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">সকল শ্রেণি</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              পৃষ্ঠা {currentPage} এর {totalPages} - {students.length}{" "}
              শিক্ষার্থী দেখাচ্ছে
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m0 0l2 2m-2-2l2 2"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {students.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              কোনো শিক্ষার্থী পাওয়া যাচ্ছে না
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-sm">
                      নাম
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">
                      শিক্ষা প্রতিষ্ঠান
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">
                      শ্রেণি
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">
                      রোল নম্বর
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">
                      মোবাইল
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">
                      ঠিকানা
                    </th>
                    <th className="px-4 py-4 text-center font-semibold text-sm">
                      ক্রিয়া
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student._id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-4 font-medium text-gray-800 text-sm">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {student.schoolName}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        <span className="badge badge-primary">
                          {student.className}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {student.rollNumber || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {student.mobileNumber}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm max-w-xs truncate">
                        {student.address || "—"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() =>
                            handleDeleteStudent(
                              student._id,
                              student.studentName,
                            )
                          }
                          disabled={deleting === student._id}
                          className={`btn btn-sm btn-error gap-2 ${
                            deleting === student._id ? "loading" : ""
                          }`}
                        >
                          {deleting === student._id ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            <>
                              <FaTrash className="text-xs" />
                              <span className="hidden sm:inline text-xs">
                                ডিলিট
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between p-4 border-t border-gray-200 gap-2">
              <div className="text-sm text-gray-600">
                মোট: <span className="font-bold">{totalStudents}</span>{" "}
                শিক্ষার্থী
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline"
                >
                  পূর্ববর্তী
                </button>

                {/* Page numbers */}
                <div className="flex gap-1 items-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`btn btn-sm ${
                          currentPage === page ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;
