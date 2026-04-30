import { useAuth } from "../context/AuthContext";

const AdminDebug = () => {
  const { dbUser, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">🔧 Admin Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Loading Status:</h2>
            <p className="text-gray-700">{loading ? "⏳ Loading..." : "✅ Loaded"}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">User Email:</h2>
            <p className="text-gray-700 font-mono">{dbUser?.email || "❌ No email"}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">User Role:</h2>
            <p className={`text-gray-700 font-mono font-bold text-lg ${
              dbUser?.role === 'admin' ? 'text-green-600' : 'text-red-600'
            }`}>
              {dbUser?.role || "❌ No role"} 
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Full User Object:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(dbUser, null, 2) || "No user data"}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Should Show Admin Dashboard?</h2>
            <p className={`text-lg font-bold ${
              dbUser?.role === 'admin' ? 'text-green-600' : 'text-red-600'
            }`}>
              {dbUser?.role === 'admin' ? '✅ YES - Should show AdminDashboard' : '❌ NO - Will show StudentDashboard'}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong><br/>
              1. Check the user object above<br/>
              2. If role shows as "user", go to <a href="/admin/setup" className="underline font-bold">Admin Setup</a> to promote<br/>
              3. Then log out completely and log back in<br/>
              4. Refresh this page to see updated role
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug;
