import { FaMedal, FaSignOutAlt, FaTrophy, FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../assets/logo_2.jpg";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ user }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="navbar bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white text-gray-800 rounded-box w-52"
          >
            <li>
              <Link to="/">হোম</Link>
            </li>
            <li>
              <Link to="/quizzes">কুইজ</Link>
            </li>
            <li>
              <Link to="/results">ফলাফল</Link>
            </li>
            {user && (
              <li>
                <Link to="/dashboard">ড্যাশবোর্ড</Link>
              </li>
            )}
          </ul>
        </div>
        <Link
          to="/"
          className="btn normal-case text-xl font-bold flex items-center gap-2 px-0 py-0 mx-0 rounded-lg"
        >
          <img
            src={logo}
            alt="QuizMaster Logo"
            className="h-10 w-10 rounded-2xl"
          />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link
              to="/"
              className="hover:bg-white/20 rounded-lg transition-all"
            >
              হোম
            </Link>
          </li>
          <li>
            <Link
              to="/quizzes"
              className="hover:bg-white/20 rounded-lg transition-all"
            >
              <FaTrophy className="mr-1" />
              কুইজ
            </Link>
          </li>
          <li>
            <Link
              to="/results"
              className="hover:bg-white/20 rounded-lg transition-all"
            >
              <FaMedal className="mr-1" />
              ফলাফল
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/dashboard"
                className="hover:bg-white/20 rounded-lg transition-all"
              >
                <MdDashboard className="mr-1" />
                ড্যাশবোর্ড
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-white ring-offset-2">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <FaUserCircle className="text-3xl" />
                  </div>
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white text-gray-800 rounded-box w-64"
            >
              <li className="menu-title">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
                {user.role === "admin" && (
                  <span className="badge badge-primary badge-sm mt-1">
                    Admin
                  </span>
                )}
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-700">
                  <MdDashboard />
                  ড্যাশবোর্ড
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  লগআউট
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm bg-white text-indigo-600 hover:bg-gray-100 border-0"
          >
            লগইন
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
