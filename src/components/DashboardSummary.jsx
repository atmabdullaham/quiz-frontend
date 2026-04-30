import { useQuery } from "@tanstack/react-query";
import { FaMedal, FaNewspaper } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import axios from "../utils/axios";

const DashboardSummary = () => {
  const { data: quizzes = [] } = useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/quizzes");
      return data;
    },
  });

  const { data: results = [] } = useQuery({
    queryKey: ["admin-results-count"],
    queryFn: async () => {
      const { data } = await axios.get("/api/published-results");
      return data;
    },
  });

  const { data: notices = [] } = useQuery({
    queryKey: ["admin-notices"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/notices");
      return data;
    },
  });

  const stats = [
    {
      label: "মোট কুইজ",
      value: quizzes.length,
      icon: <MdQuiz className="text-3xl" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "প্রকাশিত ফলাফল",
      value: results.length,
      icon: <FaMedal className="text-3xl" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      label: "সক্রিয় নোটিস",
      value: notices.filter((n) => n.isActive).length,
      icon: <FaNewspaper className="text-3xl" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      label: "সর্বমোট নোটিস",
      value: notices.length,
      icon: <FaNewspaper className="text-3xl" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="glass-card p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <div className={stat.textColor}>{stat.icon}</div>
              </div>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Status */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          কুইজ ও ফলাফলের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
            <p className="text-gray-600 text-sm">সক্রিয় কুইজ</p>
            <p className="text-2xl font-bold text-blue-600">
              {quizzes.filter((q) => q.status === "active").length}
            </p>
          </div>
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
            <p className="text-gray-600 text-sm">সময়সূচীবদ্ধ কুইজ</p>
            <p className="text-2xl font-bold text-purple-600">
              {quizzes.filter((q) => q.status === "scheduled").length}
            </p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
            <p className="text-gray-600 text-sm">প্রকাশিত ফলাফল</p>
            <p className="text-2xl font-bold text-green-600">
              {results.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
