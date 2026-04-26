import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import axios from "../utils/axios";

const NoticeManager = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    displayLocation: "all",
    isActive: true,
  });

  const { data: notices = [] } = useQuery({
    queryKey: ["admin-notices"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/notices");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      await axios.post("/api/admin/notices", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-notices"]);
      toast.success("নোটিস সফলভাবে যোগ করা হয়েছে");
      resetForm();
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("নোটিস যোগ করতে ব্যর্থ");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await axios.put(`/api/admin/notices/${data._id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-notices"]);
      toast.success("নোটিস সফলভাবে আপডেট হয়েছে");
      resetForm();
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("নোটিস আপডেট করতে ব্যর্থ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/admin/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-notices"]);
      toast.success("নোটিস সফলভাবে মুছে ফেলা হয়েছে");
    },
    onError: () => {
      toast.error("নোটিস মুছতে ব্যর্থ");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      displayLocation: "all",
      isActive: true,
    });
    setEditingNotice(null);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      displayLocation: notice.displayLocation,
      isActive: notice.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("শিরোনাম এবং বিষয়বস্তু উভয়ই প্রয়োজন");
      return;
    }

    if (editingNotice) {
      updateMutation.mutate({ ...formData, _id: editingNotice._id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("আপনি কি এই নোটিস মুছতে নিশ্চিত?")) {
      deleteMutation.mutate(id);
    }
  };

  const getLocationBadge = (location) => {
    const badges = {
      home: "badge-warning",
      quiz: "badge-primary",
      result: "badge-info",
      all: "badge-success",
    };
    const labels = {
      home: "হোম পৃষ্ঠা",
      quiz: "কুইজ পৃষ্ঠা",
      result: "ফলাফল পৃষ্ঠা",
      all: "সব পৃষ্ঠা",
    };
    return (
      <span className={`badge ${badges[location] || "badge-neutral"}`}>
        {labels[location] || location}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Notice Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
        >
          <FaPlusCircle />
          নোটিস যোগ করুন
        </button>
      </div>

      {/* Notices Table */}
      <div className="glass-card overflow-x-auto">
        {notices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">কোনো নোটিস নেই</p>
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-gray-800 font-bold">শিরোনাম</th>
                <th className="text-gray-800 font-bold">অবস্থান</th>
                <th className="text-gray-800 font-bold">স্থিতি</th>
                <th className="text-gray-800 font-bold">তৈরি</th>
                <th className="text-gray-800 font-bold">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice._id} className="hover:bg-gray-50">
                  <td>
                    <div className="font-semibold text-gray-800">
                      {notice.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">
                      {notice.content}
                    </div>
                  </td>
                  <td>{getLocationBadge(notice.displayLocation)}</td>
                  <td>
                    <span
                      className={`badge ${
                        notice.isActive ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {notice.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600">
                    {new Date(notice.createdAt).toLocaleDateString("bn-BD")}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="btn btn-sm btn-ghost gap-1 text-blue-600"
                        disabled={
                          updateMutation.isLoading || createMutation.isLoading
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaPlusCircle className="text-blue-600" />
              {editingNotice ? "নোটিস সম্পাদনা করুন" : "নতুন নোটিস যোগ করুন"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  শিরোনাম *
                </label>
                <input
                  type="text"
                  placeholder="নোটিসের শিরোনাম"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  বিষয়বস্তু *
                </label>
                <textarea
                  placeholder="নোটিসের বিষয়বস্তু"
                  className="textarea textarea-bordered w-full h-32 resize-none"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              {/* Display Location */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  প্রদর্শনের স্থান *
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.displayLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayLocation: e.target.value,
                    })
                  }
                >
                  <option value="all">সব পৃষ্ঠা</option>
                  <option value="home">হোম পৃষ্ঠা</option>
                  <option value="quiz">কুইজ পৃষ্ঠা</option>
                  <option value="result">ফলাফল পৃষ্ঠা</option>
                </select>
              </div>

              {/* Active Status */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">সক্রিয় করুন</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                >
                  {editingNotice ? "আপডেট করুন" : "যোগ করুন"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-ghost flex-1"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManager;
