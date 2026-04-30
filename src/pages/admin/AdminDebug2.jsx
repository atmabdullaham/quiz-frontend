import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";

const AdminDebug = () => {
  const { dbUser, loading } = useAuth();
  const [backendUserData, setBackendUserData] = useState(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchBackendData = async () => {
      if (!loading) {
        setBackendLoading(true);
        try {
          console.log("🔍 Fetching fresh user data from backend...");
          const { data } = await axios.get("/api/auth/me");
          console.log("📦 Backend response:", data);
          setBackendUserData(data);
        } catch (error) {
          console.error("❌ Error fetching backend data:", error);
        } finally {
          setBackendLoading(false);
        }
      }
    };

    fetchBackendData();
  }, [loading, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  console.log("🔍 AdminDebug rendered for user:", dbUser?.email, "role:", dbUser?.role);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-600">🔧 Admin Debug Info</h1>
          <button
            onClick={handleRefresh}
            className="btn btn-sm btn-primary"
          >
            🔄 Refresh Backend Data
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Frontend User Data */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">📱 Frontend Data (from React Context)</h2>
            
            <div>
              <h3 className="font-medium text-gray-700">Loading Status:</h3>
              <p className="text-gray-700 font-mono">{loading ? "⏳ Loading..." : "✅ Loaded"}</p>
            </div>

            <div className="mt-3">
              <h3 className="font-medium text-gray-700">User Email:</h3>
              <p className="text-gray-700 font-mono">{dbUser?.email || "❌ No email"}</p>
            </div>

            <div className="mt-3">
              <h3 className="font-medium text-gray-700">User Role:</h3>
              <p className={`font-mono font-bold text-lg ${
                dbUser?.role === 'admin' ? 'text-green-600' : 'text-red-600'
              }`}>
                {dbUser?.role || "❌ No role"} 
              </p>
            </div>

            <div className="mt-4 bg-gray-50 p-3 rounded">
              <h3 className="font-medium text-gray-700 mb-2">Full Frontend User Object:</h3>
              <pre className="text-sm overflow-auto max-h-48 text-gray-600">
                {JSON.stringify(dbUser, null, 2) || "No user data"}
              </pre>
            </div>
          </div>

          {/* Backend User Data */}
          <div className="border-l-4 border-green-500 pl-4">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🖥️  Backend Data (fresh from API)</h2>
            
            {backendLoading ? (
              <p className="text-gray-700">⏳ Loading from backend...</p>
            ) : backendUserData ? (
              <>
                <div>
                  <h3 className="font-medium text-gray-700">User Email:</h3>
                  <p className="text-gray-700 font-mono">{backendUserData?.email || "❌ No email"}</p>
                </div>

                <div className="mt-3">
                  <h3 className="font-medium text-gray-700">User Role:</h3>
                  <p className={`font-mono font-bold text-lg ${
                    backendUserData?.role === 'admin' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {backendUserData?.role || "❌ No role"} 
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <h3 className="font-medium text-gray-700 mb-2">Full Backend User Object:</h3>
                  <pre className="text-sm overflow-auto max-h-48 text-gray-600">
                    {JSON.stringify(backendUserData, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <p className="text-red-600">❌ Failed to load backend data</p>
            )}
          </div>

          {/* Comparison and Status */}
          <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">🔍 Status Check</h2>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium">Frontend Role:</p>
                <p className={`font-bold ${dbUser?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                  {dbUser?.role === 'admin' ? '✅ ADMIN' : '❌ USER'}
                </p>
              </div>

              <div>
                <p className="font-medium">Backend Role:</p>
                <p className={`font-bold ${backendUserData?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                  {backendUserData?.role === 'admin' ? '✅ ADMIN' : '❌ USER'}
                </p>
              </div>

              <div>
                <p className="font-medium">Should Show Admin Dashboard?</p>
                <p className={`text-lg font-bold ${
                  dbUser?.role === 'admin' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dbUser?.role === 'admin' ? '✅ YES' : '❌ NO'}
                </p>
              </div>

              <div>
                <p className="font-medium">Frontend & Backend Match?</p>
                <p className={`text-lg font-bold ${
                  dbUser?.role === backendUserData?.role ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {dbUser?.role === backendUserData?.role ? '✅ YES' : '⚠️ MISMATCH'}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="text-sm text-blue-800 font-medium mb-3">📌 Next Steps:</p>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>If role shows as "user" above, go to <a href="/admin/setup" className="underline font-bold">Admin Setup</a> to promote</li>
              <li>After promoting, <strong>log out completely</strong> (button in navbar dropdown)</li>
              <li>Clear browser cache: <code className="bg-blue-100 px-2 py-1 rounded">Ctrl+Shift+Delete</code> or <code className="bg-blue-100 px-2 py-1 rounded">Cmd+Shift+Delete</code></li>
              <li>Close and reopen this browser tab</li>
              <li>Log back in with the same email</li>
              <li>Refresh this page to verify role is now "admin"</li>
              <li>Navigate to <a href="/dashboard" className="underline font-bold">/dashboard</a> to see admin dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug;
