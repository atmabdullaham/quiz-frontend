import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">
              কিশোরকণ্ঠ পাঠক ফোরাম
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              চট্টগ্রাম মহানগর উত্তর
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={"/"}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → হোম
                </Link>
              </li>
              <li>
                <Link
                  to={"quizzes"}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → কুইজ
                </Link>
              </li>
              <li>
                <Link
                  to={"/results"}
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → ফলাফল
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → আমাদের সম্পর্কে
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">তথ্য</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → গোপনীয়তা নীতি
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → শর্তাবলী
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → নিয়মকানুন
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  → যোগাযোগ করুন
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">যোগাযোগ</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  কিশোরকণ্ঠ পাঠক ফোরাম, চট্টগ্রাম মহানগর উত্তর কার্যালয়। আর
                  ইসরা ভবন, ডিসি রোড, চকবাজার,চট্টগ্রাম।
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400">+880 1XXXX-XXXXXX</p>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400">kkrf.ctgnorth@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 text-gray-400 text-xs md:text-sm">
            <p>© ২০२६ কিশোরকণ্ঠ পাঠক ফোরাম। সর্বাধিকার সংরক্ষিত।</p>
            <div className="flex gap-6">
              <a
                href="https://www.facebook.com/people/%E0%A6%95%E0%A6%BF%E0%A6%B6%E0%A7%8B%E0%A6%B0%E0%A6%95%E0%A6%A8%E0%A7%8D%E0%A6%A0-%E0%A6%AA%E0%A6%BE%E0%A6%A0%E0%A6%95-%E0%A6%AB%E0%A7%8B%E0%A6%B0%E0%A6%BE%E0%A6%AE-%E0%A6%9A%E0%A6%9F%E0%A7%8D%E0%A6%9F%E0%A6%97%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%AE-%E0%A6%AE%E0%A6%B9%E0%A6%BE%E0%A6%A8%E0%A6%97%E0%A6%B0-%E0%A6%89%E0%A6%A4%E0%A7%8D%E0%A6%A4%E0%A6%B0/61555590345773/"
                className="hover:text-white transition-all"
              >
                ফেসবুক
              </a>
              <a href="#" className="hover:text-white transition-all">
                ইউটিউব
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
