import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaTimes,
} from "react-icons/fa";
import axios from "../../utils/axios";

const MembershipRequests = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch membership requests
  const { data: requestsData = {}, isLoading: loadingRequests } = useQuery({
    queryKey: ["membership-requests", filterStatus],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/admin/membership/requests?status=${filterStatus}`,
      );
      return data;
    },
    retry: 1,
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (userId) => {
      const { data } = await axios.patch(
        `/api/admin/membership/${userId}/approve`,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["membership-requests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "অনুমোদন ব্যর্থ হয়েছে");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      const { data } = await axios.patch(
        `/api/admin/membership/${userId}/reject`,
        { reason },
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectionReason("");
      queryClient.invalidateQueries(["membership-requests"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "প্রত্যাখ্যান ব্যর্থ হয়েছেছে",
      );
    },
  });

  const handleApprove = (userId) => {
    approveMutation.mutate(userId);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      toast.error("প্রত্যাখ্যানের কারণ প্রদান করুন");
      return;
    }
    rejectMutation.mutate({
      userId: selectedRequest._id,
      reason: rejectionReason,
    });
  };

  if (loadingRequests) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const requests = requestsData.requests || [];
  const total = requestsData.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">সদস্যপদ অনুরোধ ব্যবস্থাপনা</h1>
        <p className="text-purple-100">
          নতুন সদস্যপদ আবেদন পর্যালোচনা এবং অনুমোদন করুন
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            স্ট্যাটাস ফিল্টার করুন
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="pending">পর্যালোচনাধীন</option>
            <option value="active">অনুমোদিত</option>
            <option value="rejected">প্রত্যাখ্যান করা</option>
          </select>
        </div>
        <div className="flex items-end">
          <div className="badge badge-lg badge-primary">মোট: {total}</div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            কোনো অনুরোধ নেই
          </h3>
          <p className="text-gray-600">
            {filterStatus === "pending"
              ? "পর্যালোচনার জন্য নতুন সদস্যপদ অনুরোধ নেই"
              : `এই ফিল্টারের জন্য কোনো অনুরোধ নেই`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* User Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <img
                          src={request.picture}
                          alt={request.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.src =
                              "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                              request.email;
                          }}
                        />
                        {request.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                        <FaEnvelope className="text-indigo-600" />
                        {request.email}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {request.membership?.status === "pending" && (
                        <span className="badge badge-warning badge-lg">
                          পর্যালোচনাধীন
                        </span>
                      )}
                      {request.membership?.status === "active" && (
                        <span className="badge badge-success badge-lg">
                          অনুমোদিত
                        </span>
                      )}
                      {request.membership?.status === "rejected" && (
                        <span className="badge badge-error badge-lg">
                          প্রত্যাখ্যান করা
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>শিক্ষার্থী নাম:</strong>
                      <br />
                      {request.profile?.studentName || "—"}
                    </p>
                    <p className="text-gray-700 flex items-start gap-2">
                      <FaSchool className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>প্রতিষ্ঠান:</strong>
                        <br />
                        {request.profile?.schoolName || "—"}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <strong>শ্রেণি:</strong>{" "}
                      {request.profile?.className || "—"}
                      {request.profile?.rollNumber &&
                        ` | রোল: ${request.profile?.rollNumber}`}
                    </p>
                    <p className="text-gray-700 flex items-start gap-2">
                      <FaPhone className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>ফোন:</strong>
                        <br />
                        {request.profile?.mobileNumber || "—"}
                      </span>
                    </p>
                  </div>

                  {/* Timeline Info */}
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>আবেদন তারিখ:</strong>
                      <br />
                      {request.membership?.requestedAt
                        ? new Date(
                            request.membership.requestedAt,
                          ).toLocaleString("bn-BD")
                        : "—"}
                    </p>

                    {request.membership?.reviewedAt && (
                      <p className="text-gray-700">
                        <strong>পর্যালোচনার তারিখ:</strong>
                        <br />
                        {new Date(request.membership.reviewedAt).toLocaleString(
                          "bn-BD",
                        )}
                      </p>
                    )}

                    {request.membership?.rejectionReason && (
                      <p className="text-red-700">
                        <strong>প্রত্যাখ্যানের কারণ:</strong>
                        <br />
                        {request.membership.rejectionReason}
                      </p>
                    )}

                    {/* Action Buttons */}
                    {request.membership?.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={approveMutation.isPending}
                          className="btn btn-sm btn-success btn-outline flex-1 gap-1"
                        >
                          <FaCheck className="text-sm" />
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => handleRejectClick(request)}
                          disabled={rejectMutation.isPending}
                          className="btn btn-sm btn-error btn-outline flex-1 gap-1"
                        >
                          <FaTimes className="text-sm" />
                          প্রত্যাখ্যান
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Section */}
                {request.profile?.address && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>ঠিকানা:</strong> {request.profile.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">সদস্যপদ প্রত্যাখ্যান করুন</h3>
            <p className="py-4 text-gray-700">
              {selectedRequest?.name} এর সদস্যপদ অনুরোধ প্রত্যাখ্যান করতে
              চলেছেন? এটি একটি স্থায়ী পদক্ষেপ নয় এবং ব্যবহারকারী পুনরায় আবেদন
              করতে পারেন।
            </p>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  প্রত্যাখ্যানের কারণ *
                </span>
              </label>
              <textarea
                placeholder="প্রত্যাখ্যানের কারণ বর্ণনা করুন..."
                className="textarea textarea-bordered h-24"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectionReason("");
                }}
                className="btn btn-ghost"
              >
                বাতিল
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending}
                className="btn btn-error"
              >
                {rejectMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    প্রক্রিয়াকরণ...
                  </>
                ) : (
                  "প্রত্যাখ্যান করুন"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowRejectModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MembershipRequests;
