import React, { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

const Admin_Login = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Invalid password."
        );
      }

      window.location.replace("/admin");

    } catch (error) {
      console.error("Admin login error:", error);

      alert(
        error.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7FBFF] via-white to-[#EAF4FF] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* Login Card */}

        <div className="rounded-2xl border border-[#DCEAF7] bg-white/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(30,100,160,0.12)] backdrop-blur-sm">

          {/* Beacon Icon */}

          <div className="flex justify-center">

            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0B5FA5] to-[#4BA3DF] shadow-lg shadow-[#0B5FA5]/20">

              <div className="absolute inset-2 rounded-full border border-white/20" />

              <div className="relative flex items-center justify-center">

                <ShieldCheck
                  className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                  strokeWidth={1.8}
                />

              </div>

            </div>

          </div>


          {/* Heading */}

          <div className="mt-5 text-center">

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#12344D]">
              Prism Pannel
            </h1>

            <p className="mt-2 text-sm sm:text-base text-[#71879A]">
              Secure access to your administration panel
            </p>

          </div>


          {/* Password */}

          <div className="mt-7">

            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-[#31546D]"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              disabled={loading}
              className="h-12 w-full rounded-xl border border-[#D5E5F2] bg-[#F8FBFE] px-4 text-sm text-[#12344D] outline-none transition placeholder:text-[#9AAEBD] focus:border-[#3D94CC] focus:bg-white focus:ring-4 focus:ring-[#3D94CC]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>


          {/* CTA */}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B5FA5] to-[#318BC4] px-5 text-sm sm:text-base font-semibold text-white shadow-md shadow-[#0B5FA5]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0B5FA5]/25 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#3D94CC]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >

            <ArrowRight
              className="h-5 w-5"
              strokeWidth={2.2}
            />

            <span>
              {loading
                ? "Checking..."
                : "Access Pannel"}
            </span>

          </button>


          {/* Security Note */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8AA0B0]">

            <ShieldCheck className="h-4 w-4" />

            <span>
              Authorized access only
            </span>

          </div>

        </div>


        {/* Footer */}

        <p className="mt-5 text-center text-xs text-[#8AA0B0]">
          Prism Administration
        </p>

      </div>

    </div>
  );
};

export default Admin_Login;