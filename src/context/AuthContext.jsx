import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../config/firebase";
import axios from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Set loading to false after a short delay to allow UI to render
    const uiRenderTimer = setTimeout(() => {
      setLoading(false);
    }, 300); // Allow UI to mount first

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);

          // Register/fetch user from backend
          const { data } = await axios.post(
            "/auth/register",
            {
              firebaseUid: user.uid,
              email: user.email,
              name: user.displayName,
              picture: user.photoURL,
            },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            },
          );

          setDbUser(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to sync user data");
        }
      } else {
        setToken(null);
        setDbUser(null);
      }

      setAuthCheckComplete(true);
    });

    return () => {
      clearTimeout(uiRenderTimer);
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Register user in backend
      const { data } = await axios.post(
        "/auth/register",
        {
          firebaseUid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          picture: result.user.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      setDbUser(data);
      toast.success("Logged in successfully!");
      return result.user;
    } catch (error) {
      // console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setDbUser(null);
      setToken(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      // console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const value = {
    currentUser,
    dbUser,
    token,
    loading,
    authCheckComplete,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
