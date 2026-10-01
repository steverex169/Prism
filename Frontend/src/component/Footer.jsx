import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/email/save-email`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email_address: trimmedEmail,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          detail: text || "Unexpected server response.",
        };
      }

      if (!response.ok) {
        let errorMessage =
          "Something went wrong. Please try again.";

        if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((item) =>
              typeof item === "string"
                ? item
                : item.msg || "Invalid information."
            )
            .join(" ");
        } else if (typeof data.detail === "string") {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      setMessage(
        data.message || "Subscribed successfully!"
      );

      setEmail("");
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage(
          "Unable to connect to the server. Please try again."
        );
      } else {
        setMessage(
          error.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#061727] text-[#f7e8d0]">
      {/* Light Grid Background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.16]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 4px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 4px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1180px]

          px-5
          py-12

          sm:px-6
          sm:py-14

          md:px-8
          md:py-16

          lg:px-10
          lg:py-18

          xl:px-12
          xl:py-20

          2xl:px-0
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10

            sm:grid-cols-2
            sm:gap-x-10
            sm:gap-y-12

            lg:grid-cols-[1fr_0.6fr_1fr_1.1fr]
            lg:gap-12
          "
        >
          {/* Contact */}
          <div>
            <h3 className="text-[16px] font-bold text-white sm:text-[17px] lg:text-[18px]">
              Contact
            </h3>

            <p className="mt-5 text-[14px] font-normal leading-[1.7] text-[#9b9d9f] sm:text-[15px]">
              Contact our support team
            </p>
          </div>

          {/* Our Company */}
          <div>
            <h3 className="text-[16px] font-bold text-white sm:text-[17px] lg:text-[18px]">
              Our Company
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              <Link
                to="/contact"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Contact Us
              </Link>

              <Link
                to="/about"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-[16px] font-bold text-white sm:text-[17px] lg:text-[18px]">
              Useful Links
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              <a
                href="/#faq"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                FAQs
              </a>

              <Link
                to="/terms"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/privacy"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Privacy Policy
              </Link>

              <Link
                to="/refund"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Refund & Return Policy
              </Link>

              <Link
                to="/shipping"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Shipping & Delivery Policy
              </Link>

              <Link
                to="/quality"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Quality Assurance
              </Link>

              <Link
                to="/third"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Third-Party Testing
              </Link>

              <Link
                to="/certificate"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Certificates of Analysis
              </Link>

              <Link
                to="/manufacturing"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Manufacturing Standards
              </Link>

              <Link
                to="/compliance"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Compliance Statement
              </Link>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-[16px] font-bold text-white sm:text-[17px] lg:text-[18px]">
              Subscribe to our email
            </h3>

            <form
              onSubmit={handleSubscribe}
              className="mt-5 flex w-full max-w-[320px]"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
                autoComplete="email"
                required
                disabled={loading}
                className="
                  h-[44px]
                  min-w-0
                  flex-1
                  border
                  border-[#4c5863]
                  bg-[#223344]
                  px-4
                  text-[13px]
                  text-white
                  outline-none
                  placeholder:text-[#9ca5ad]
                  focus:border-[#00a4d8]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  sm:text-[14px]
                "
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  h-[44px]
                  shrink-0
                  bg-[#0ea6d8]
                  px-5
                  text-[13px]
                  font-bold
                  uppercase
                  text-white
                  transition-colors
                  duration-200
                  hover:bg-[#1296c0]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:px-6
                  sm:text-[14px]
                "
              >
                {loading ? "Saving..." : "Sign Up"}
              </button>
            </form>

            {message && (
              <p className="mt-3 text-[13px] text-[#9b9d9f]">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-14 h-px w-full bg-[#304052] sm:mt-16 lg:mt-20" />

        {/* Required Research Use Disclaimer */}
        <div className="pt-6 text-center">
          <p className="text-[12px] leading-[1.7] text-[#b3bac2] sm:text-[13px]">
            For research and laboratory use only. Not for human or animal consumption.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;