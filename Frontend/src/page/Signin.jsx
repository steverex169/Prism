import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/bgImg.jpg";

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    agreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const backgroundImage = authBg;

  // =====================================================
  // PASSWORD CHECK
  // This mirrors the main rules used by the backend.
  // Backend validation is still the final authority.
  // =====================================================
  const checkPasswordStrength = (password) => {
    if (!password) {
      return {
        strong: false,
        message: "",
      };
    }

    if (password.length < 12) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    if (!/\d/.test(password)) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    const normalized = password.toLowerCase();

    const weakPatterns = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "asdfgh",
      "abcdef",
      "@umt123",
      "umt123",
    ];

    if (weakPatterns.some((item) => normalized.includes(item))) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    if (/(.)\1{3,}/.test(password)) {
      return {
        strong: false,
        message: "Password is weak",
      };
    }

    return {
      strong: true,
      message: "Password is strong",
    };
  };

  const passwordStrength = checkPasswordStrength(
    formData.password
  );

  const passwordsMatch =
    formData.confirm_password.length > 0 &&
    formData.password === formData.confirm_password;

  // =====================================================
  // HANDLE INPUT
  // =====================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setMessage("");
  };

  // =====================================================
  // SIGNUP
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!passwordStrength.strong) {
      setError(
        "Please choose a stronger password before continuing."
      );
      return;
    }

    if (
      formData.password !== formData.confirm_password
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreed) {
      setError(
        "You must agree to the Terms & Conditions."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/user/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            confirm_password:
              formData.confirm_password,
            agreed: formData.agreed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage =
          "Unable to create your account.";

        /*
          FastAPI validation errors often return:
          {
            detail: [...]
          }
        */
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((item) => item.msg)
            .join(" ");
        } else if (data.detail) {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      // ---------------------------------------------
      // JWT
      // ---------------------------------------------
      if (data.access_token) {
        /*
          Better than localStorage for now because the
          token disappears when the browser session ends.

          Later we should move authentication to a
          Secure + HttpOnly cookie from FastAPI.
        */
        sessionStorage.setItem(
          "access_token",
          data.access_token
        );
      }

      if (data.user) {
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage(
        data.message || "Account created successfully."
      );

      setFormData({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
        agreed: false,
      });

      // Small delay so the success message is visible.
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
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
          src={backgroundImage}
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

      {/* ================= SIGNUP CARD ================= */}
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
          Create your account
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
          Enter your details below to get started.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 sm:mt-7 sm:space-y-5"
        >
          {/* FULL NAME */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#252b39]">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
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
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              className={`
                h-[48px]
                w-full
                rounded-[7px]
                border
                bg-white
                px-4
                text-[14px]
                text-[#1f2937]
                outline-none
                transition

                placeholder:text-[#9aa1aa]

                sm:h-[52px]
                sm:text-[15px]

                ${
                  formData.password
                    ? passwordStrength.strong
                      ? "border-green-500 focus:ring-2 focus:ring-green-500/10"
                      : "border-red-400 focus:ring-2 focus:ring-red-400/10"
                    : "border-[#d7dce3] focus:border-[#159bc7] focus:ring-2 focus:ring-[#159bc7]/10"
                }
              `}
            />

            {/* PASSWORD STATUS */}
            {formData.password && (
              <p
                className={`
                  mt-1.5
                  text-[12px]
                  font-medium

                  ${
                    passwordStrength.strong
                      ? "text-green-600"
                      : "text-red-500"
                  }
                `}
              >
                {passwordStrength.message}
              </p>
            )}

            {/* SMALL PASSWORD REQUIREMENTS */}
            <div
              className="
                mt-2
                rounded-[6px]
                bg-[#f5f7f9]
                px-3
                py-2
              "
            >
              <p className="text-[11px] leading-[1.6] text-[#737b87] sm:text-[12px]">
                Use 12+ characters with uppercase,
                lowercase, a number and a special
                character.
              </p>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#252b39]">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
              className={`
                h-[48px]
                w-full
                rounded-[7px]
                border
                bg-white
                px-4
                text-[14px]
                text-[#1f2937]
                outline-none
                transition

                placeholder:text-[#9aa1aa]

                sm:h-[52px]
                sm:text-[15px]

                ${
                  formData.confirm_password
                    ? passwordsMatch
                      ? "border-green-500"
                      : "border-red-400"
                    : "border-[#d7dce3]"
                }

                focus:ring-2
                focus:ring-[#159bc7]/10
              `}
            />

            {formData.confirm_password && (
              <p
                className={`
                  mt-1.5
                  text-[12px]
                  font-medium

                  ${
                    passwordsMatch
                      ? "text-green-600"
                      : "text-red-500"
                  }
                `}
              >
                {passwordsMatch
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* TERMS */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className="
                mt-[3px]
                h-[16px]
                w-[16px]
                shrink-0
                cursor-pointer
                accent-[#159bc7]
              "
            />

            <span className="text-[13px] leading-[1.6] text-[#626975] sm:text-[14px]">
              I agree to the{" "}
              <Link
                to="/terms"
                className="
                  font-medium
                  text-[#159bc7]
                  hover:underline
                "
              >
                Terms & Conditions
              </Link>
            </span>
          </label>

          {/* ERROR */}
          {error && (
            <div
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

          {/* SUCCESS */}
          {message && (
            <div
              className="
                rounded-[7px]
                border
                border-green-200
                bg-green-50
                px-4
                py-3
                text-[13px]
                text-green-700
              "
            >
              {message}
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
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="mt-6 text-center text-[13px] text-[#697181] sm:text-[14px]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-semibold
              text-[#0e9dce]
              hover:underline
            "
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signin;