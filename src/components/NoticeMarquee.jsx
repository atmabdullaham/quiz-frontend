import { useQuery } from "@tanstack/react-query";
import Marquee from "react-fast-marquee";
import { FaBell } from "react-icons/fa";
import axios from "../utils/axios";

const NoticeMarquee = ({ displayLocation = "all" }) => {
  const { data: fetchedNotices = [] } = useQuery({
    queryKey: ["notices", displayLocation],
    queryFn: async () => {
      const { data } = await axios.get(`/api/notices/${displayLocation}`);
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const notices = Array.isArray(fetchedNotices) ? fetchedNotices : [];

  if (notices.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border-t-2 border-b-2 border-yellow-400 py-3 md:py-4 shadow-sm">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notice Bell Icon Label */}
          <div className="flex items-center gap-1.5 md:gap-2 whitespace-nowrap text-yellow-700 font-bold text-xs md:text-sm flex-shrink-0">
            <FaBell className="animate-bounce text-base md:text-lg" />
            <span className="hidden md:block">নোটিসঃ:</span>
          </div>

          {/* Scrolling Notices */}
          <Marquee
            pauseOnHover={true}
            speed={25}
            direction="left"
            style={{ overflow: "hidden" }}
            className="flex-1"
          >
            {notices.map((notice, idx) => (
              <div
                key={idx}
                className="ml-2 text-xs md:text-sm font-normal text-gray-800 flex items-center gap-2"
              >
                <span className="font-medium">{notice.title}:</span>
                <span className="text-gray-700">{notice.content}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default NoticeMarquee;
