// Footer.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:8000/email/save-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setMessage("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage(error.message);
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

              <a
                href="/terms"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Terms & Conditions
              </a>

              <a
                href="/privacy"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Privacy Policy
              </a>

              <a
                href="/refund"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Refund & Return Policy
              </a>

              <a
                href="/shipping"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Shipping & Delivery Policy
              </a>

              <a
                href="/quality"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Quality Assurance
              </a>

              <a
                href="/third"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Third-Party Testing
              </a>

              <a
                href="/certificate"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Certificates of Analysis
              </a>

              <a
                href="/manufacturing"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Manufacturing Standards
              </a>

              <a
                href="/compliance"
                className="text-[14px] text-[#9b9d9f] transition-colors duration-200 hover:text-white sm:text-[15px]"
              >
                Compliance Statement
              </a>
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
                onChange={(e) => setEmail(e.target.value)}
                required
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
      </div>
    </footer>
  );
};

export default Footer;