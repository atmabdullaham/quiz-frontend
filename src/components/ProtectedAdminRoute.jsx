import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

/**
 * ProtectedAdminRoute - Verifies admin status with backend before rendering
 * This prevents users from bypassing client-side checks via DevTools
 */
const ProtectedAdminRoute = ({ children }) => {
  const { dbUser, loading: authLoading } = useAuth();
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!dbUser?.email) {
        setIsVerifiedAdmin(false);
        setVerifying(false);
        return;
      }

      try {
        // Verify admin status with backend
        const { data } = await axios.get("/api/admin/check-admin");

        // Only trust backend response, not client-side state
        const isAdmin = data?.isAdmin === true && data?.role === "admin";
        setIsVerifiedAdmin(isAdmin);

        if (!isAdmin) {
          toast.error("⛔ Unauthorized: Admin access required");
        }
      } catch (error) {
        setIsVerifiedAdmin(false);
        toast.error("⛔ Security verification failed");
      } finally {
        setVerifying(false);
      }
    };

    verifyAdminStatus();
  }, [dbUser?.email]);

  // Show loading while verifying
  if (authLoading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg text-gray-600">যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Deny access if not verified admin
  if (!isVerifiedAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render protected component only if verified
  return children;
};

export default ProtectedAdminRoute;
