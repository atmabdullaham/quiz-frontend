import { useState } from "react";
import toast from "react-hot-toast";
import axios from "../../utils/axios";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter an email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/admin/make-admin", {
        email: email.trim(),
        setupToken: setupToken.trim() || undefined,
      });

      toast.success(`✅ User ${response.data.email} is now admin!`);
      toast.success("They need to log out and log back in to see the admin dashboard");
      setEmail("");
      setSetupToken("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to promote user to admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Admin Setup</h1>
        <p className="text-gray-600 mb-6">Promote users to admin role</p>

        <form onSubmit={handleMakeAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Setup Token (optional - for initial setup)
            </label>
            <input
              type="password"
              value={setupToken}
              onChange={(e) => setSetupToken(e.target.value)}
              placeholder="Enter setup token if available"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask server administrator if you don't have this
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Processing..." : "Promote to Admin"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> After promotion, the user must log out and log back in
            to see the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
