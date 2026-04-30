import { useState } from "react";
import { FaChartBar, FaFileAlt, FaNewspaper, FaUsers } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import DashboardSummary from "../../components/DashboardSummary";
import NoticeManager from "../../components/NoticeManager";
import QuizzesSection from "../../components/QuizzesSection";
import ResultsSection from "../../components/ResultsSection";
import StudentsSection from "../../components/StudentsSection";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { dbUser } = useAuth();
  console.log(
    "✅ AdminDashboard rendered for user:",
    dbUser?.email,
    "role:",
    dbUser?.role,
  );

  const [activeTab, setActiveTab] = useState("summary");

  const tabs = [
    {
      id: "summary",
      label: "ড্যাশবোর্ড",
      icon: <FaChartBar className="text-lg" />,
      component: <DashboardSummary />,
    },
    {
      id: "quiz",
      label: "কুইজ",
      icon: <MdQuiz className="text-lg" />,
      component: <QuizzesSection />,
    },
    {
      id: "results",
      label: "ফলাফল",
      icon: <FaFileAlt className="text-lg" />,
      component: <ResultsSection />,
    },
    {
      id: "students",
      label: "শিক্ষার্থী",
      icon: <FaUsers className="text-lg" />,
      component: <StudentsSection />,
    },
    {
      id: "notice",
      label: "নোটিস",
      icon: <FaNewspaper className="text-lg" />,
      component: <NoticeManager />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            এডমিন প্যানেল
          </h1>
          <p className="text-white/90 text-base md:text-lg">
            কুইজ, ফলাফল এবং নোটিস পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex gap-2 md:gap-4 py-4 overflow-x-auto -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm md:btn-md gap-2 px-2 border transition-all ${
                activeTab === tab.id
                  ? "btn-primary border-purple-500 shadow-lg"
                  : "btn-outline hover:shadow-md"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 pb-12">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default AdminDashboard;
