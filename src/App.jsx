import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import PreQuizForm from "./pages/PreQuizForm";
import PublishedResult from "./pages/PublishedResult";
import QuizList from "./pages/QuizList";
import QuizResult from "./pages/QuizResult";
import ResultCardPreview from "./pages/ResultCardPreview";
import Results from "./pages/Results";
import StudentDashboard from "./pages/StudentDashboard";
import TakeQuiz from "./pages/TakeQuiz";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDebug from "./pages/admin/AdminDebug2";
import AdminSetup from "./pages/admin/AdminSetup";
import CreateQuiz from "./pages/admin/CreateQuiz";
import EditQuiz from "./pages/admin/EditQuiz";
import QuizStats from "./pages/admin/QuizStats";

function AppContent() {
  const { dbUser, loading } = useAuth();
  const location = useLocation();

  console.log("🔍 App Debug - dbUser:", dbUser);
  console.log("🔍 App Debug - dbUser?.role:", dbUser?.role);
  console.log("🔍 App Debug - loading:", loading);
  console.log("🔍 App Debug - Current path:", location.pathname);

  // Check if current route is a dashboard route
  const isDashboardRoute =
    location.pathname === "/dashboard" ||
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/quiz");

  // Show a minimal loading screen while UI mounts, then show interface
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <Loader label="Loading" />
      </div>
    );
  }

  // UI loads immediately, even while auth is being checked
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={dbUser} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home user={dbUser} />} />
          <Route
            path="/login"
            element={dbUser ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/quizzes" element={<QuizList user={dbUser} />} />
          <Route path="/quiz/:id" element={<PreQuizForm user={dbUser} />} />
          <Route path="/quiz/:id/take" element={<TakeQuiz user={dbUser} />} />
          <Route
            path="/quiz/:id/result"
            element={<QuizResult user={dbUser} />}
          />
          <Route path="/quiz/:id/leaderboard" element={<Leaderboard />} />

          {/* Results Routes */}
          <Route path="/results" element={<Results />} />
          <Route
            path="/published-result/:quizId"
            element={<PublishedResult />}
          />
          <Route path="/admin/result-preview" element={<ResultCardPreview />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              !dbUser ? (
                <Navigate to="/login" />
              ) : (
                (() => {
                  console.log("🔀 /dashboard route check:", {
                    hasDbUser: !!dbUser,
                    role: dbUser?.role,
                    roleType: typeof dbUser?.role,
                    isAdmin: dbUser?.role === "admin",
                    email: dbUser?.email
                  });
                  return dbUser.role === "admin" ? (
                    <AdminDashboard />
                  ) : (
                    <StudentDashboard />
                  );
                })()
              )
            }
          />
          <Route
            path="/admin"
            element={
              dbUser?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/quiz/create"
            element={
              dbUser?.role === "admin" ? <CreateQuiz /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/quiz/:id/edit"
            element={
              dbUser?.role === "admin" ? <EditQuiz /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/quiz/:id/stats"
            element={
              dbUser?.role === "admin" ? <QuizStats /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/setup"
            element={<AdminSetup />}
          />
          <Route
            path="/admin/debug"
            element={<AdminDebug />}
          />
        </Routes>
      </div>
      {/* Show Footer on all pages except dashboard */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
