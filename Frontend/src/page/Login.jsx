import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/bgImg.jpg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // INPUT CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // READ BACKEND RESPONSE SAFELY
  // =====================================================
  const readResponse = async (response) => {
    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    return {
      detail: text || "Unexpected server response.",
    };
  };

  // =====================================================
  // LOGIN
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/user/login`,
        {
          method: "POST",

          // Required so browser accepts/sends HttpOnly cookie
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email
              .trim()
              .toLowerCase(),

            password: formData.password,
          }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        let errorMessage =
          "Invalid email or password.";

        if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((item) => {
              if (typeof item === "string") {
                return item;
              }

              return item.msg || "Invalid information.";
            })
            .join(" ");
        } else if (
          typeof data.detail === "string"
        ) {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      /*
        No JWT is stored here.

        FastAPI has already sent:
        Set-Cookie: access_token=...

        The browser stores the HttpOnly cookie automatically.
      */

      navigate("/");
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please try again."
        );
        return;
      }

      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        overflow-hidden

        px-4
        py-6

        sm:px-6
        sm:py-8

        md:px-8
        md:py-10

        lg:px-10
        lg:py-12

        xl:px-12
        2xl:px-16
      "
    >
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <img
          src={authBg}
          alt=""
          aria-hidden="true"
          className="
            h-full
            w-full
            object-cover
            object-center
          "
        />

        <div className="absolute inset-0 bg-[#061727]/20" />
      </div>

      {/* ================= LOGIN CARD ================= */}
      <div
        className="
          relative
          z-10
          w-full

          max-w-[700px]

          rounded-[14px]
          bg-white

          px-5
          py-6

          shadow-[0_20px_60px_rgba(0,0,0,0.20)]

          sm:rounded-[16px]
          sm:px-7
          sm:py-8

          md:max-w-[620px]
          md:px-8
          md:py-9

          lg:max-w-[660px]
          lg:px-10
          lg:py-10

          xl:max-w-[700px]
          xl:px-12
          xl:py-11
        "
      >
        <h1
          className="
            text-center
            text-[27px]
            font-semibold
            leading-[1.15]
            tracking-[-0.03em]
            text-[#111827]

            sm:text-[30px]
            md:text-[34px]
            lg:text-[36px]
          "
        >
          Welcome back
        </h1>

        <p
          className="
            mt-2
            text-center
            text-[13px]
            leading-[1.6]
            text-[#697181]

            sm:text-[14px]
            md:text-[15px]
          "
        >
          Enter your details below to login.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 sm:mt-7 sm:space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#252b39]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              maxLength={255}
              required
              className="
                h-[48px]
                w-full
                rounded-[7px]

                border
                border-[#d7dce3]

                bg-white

                px-4

                text-[14px]
                text-[#1f2937]

                outline-none
                transition

                placeholder:text-[#9aa1aa]

                focus:border-[#159bc7]
                focus:ring-2
                focus:ring-[#159bc7]/10

                sm:h-[52px]
                sm:text-[15px]
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#252b39]">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="
                h-[48px]
                w-full
                rounded-[7px]

                border
                border-[#d7dce3]

                bg-white

                px-4

                text-[14px]
                text-[#1f2937]

                outline-none
                transition

                placeholder:text-[#9aa1aa]

                focus:border-[#159bc7]
                focus:ring-2
                focus:ring-[#159bc7]/10

                sm:h-[52px]
                sm:text-[15px]
              "
            />
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="
                rounded-[7px]
                border
                border-red-200
                bg-red-50

                px-4
                py-3

                text-[13px]
                text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex
              h-[48px]
              w-full
              items-center
              justify-center

              rounded-[7px]

              bg-[#0ea6d8]

              text-[14px]
              font-semibold
              text-white

              transition-colors
              duration-200

              hover:bg-[#078db9]

              disabled:cursor-not-allowed
              disabled:opacity-60

              sm:h-[52px]
              sm:text-[15px]
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* SIGNUP LINK */}
        <p
          className="
            mt-6
            text-center
            text-[13px]
            text-[#697181]

            sm:text-[14px]
          "
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="
              font-semibold
              text-[#0e9dce]
              hover:underline
            "
          >
            Signup
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;