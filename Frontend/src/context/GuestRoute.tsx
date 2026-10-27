import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const GuestRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/user/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!cancelled) {
          setAuthenticated(response.ok);
        }
      } catch {
        if (!cancelled) {
          setAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-[14px] text-[#697181]">
          Loading...
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
