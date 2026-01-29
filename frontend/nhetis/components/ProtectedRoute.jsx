import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // show spinner while checking auth
  if (!user) return <Navigate to="/login" replace />; // redirect to login if not logged in

  return children; // user is logged in
};

export default ProtectedRoute;

