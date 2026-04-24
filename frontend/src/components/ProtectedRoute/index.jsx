import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.dismiss(); // ✅ clear previous toasts
      toast.error("Please login first"); // ✅ show only once
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;