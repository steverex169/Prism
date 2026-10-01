// Contact.jsx

import React, { useEffect, useState } from "react";
import {
  Mail,
  FlaskConical,
  ShoppingCart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const Contact = () => {
  const [heroImage, setHeroImage] = useState(null);
  const contactData = {
    backgroundImage: heroImage,

    badgeText: "GET IN TOUCH",

    titleFirst: "Get in",
    titleHighlight: "Touch",

    description:
      "Have questions about our peptide products or your order? Our team is ready to help you with any inquiry.",
  };

  useEffect(() => {
    const fetchContactHero = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/hero/?t=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hero images");
        }

        const result = await response.json();

        const contactHero = result.data?.find(
          (hero) =>
            hero.section_name?.trim().toLowerCase() === "contact"
        );

        if (contactHero?.image_url) {
          const imageUrl = `http://localhost:8000/${contactHero.image_url}`;

          setHeroImage(`${imageUrl}?t=${Date.now()}`);
        } else {
          setHeroImage(null);
        }
      } catch (error) {
        console.error(
          "Failed to load Contact hero image:",
          error
        );
      }
    };

    fetchContactHero();
  }, []);

  return (
    <>
      <section
        className="
        relative
        flex
        min-h-[360px]
        w-full
        items-center
        overflow-hidden
        bg-[#07182a]
        bg-cover
        bg-center
        bg-no-repeat
        font-sans

        sm:min-h-[390px]
        md:min-h-[420px]
        lg:min-h-[450px]
        xl:min-h-[470px]
      "
        style={{
          backgroundImage: `url(${contactData.backgroundImage})`,
        }}
        id="contact"
      >
        <div
          className="
    pointer-events-none
    absolute
    inset-0
    z-0
    bg-gradient-to-l
    from-[#0a2b45]65
    via-[#0a2b45]/80
    to-[#0a2b45]
  "
        />

        {/* Very Soft Left Darkening */}
        <div
          className="
    pointer-events-none
    absolute
    inset-0
    z-[1]
    bg-gradient-to-r
    from-[#081325]/45
    via-[#2C3E50]/15
    to-transparent
  "
        />

        {/* Visible Blue Grid Overlay */}
        <div
          className="
    pointer-events-none
    absolute
    inset-0
    z-[2]
  "
          style={{
            backgroundImage: `
      linear-gradient(
        rgba(73, 132, 170, 0.13) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(73, 132, 170, 0.13) 1px,
        transparent 1px
      )
    `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Content */}
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
          lg:py-20

          xl:px-12

          2xl:px-0
        "
        >
          <div
            className="
            w-full
            max-w-[520px]

            sm:max-w-[560px]
            md:max-w-[620px]
            lg:max-w-[650px]
          "
          >
            {/* Blue Accent */}
            <div
              className="
              mb-5
              h-[3px]
              w-[40px]
              bg-[#0b93ff]

              sm:w-[44px]
            "
            />

            {/* Badge */}
            <div
              className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#1266c7]
              bg-[#0b3f7a]/20

              px-3
              py-1.5

              text-[11px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#2d9bff]

              sm:px-4
              sm:text-[12px]

              md:text-[13px]
            "
            >
              <Mail size={13} strokeWidth={1.8} />

              {contactData.badgeText}
            </div>

            {/* Heading */}
            <h1
              className="
              mt-5
              text-[42px]
              font-bold
              leading-[1]
              tracking-[-0.035em]
              text-white

              sm:text-[50px]
              md:text-[58px]
              lg:text-[64px]
              xl:text-[70px]
            "
            >
              {contactData.titleFirst}{" "}
              <span className="text-[#087ef5]">
                {contactData.titleHighlight}
              </span>
            </h1>

            {/* Description */}
            <p
              className="
              mt-5
              max-w-[520px]

              text-[15px]
              font-normal
              leading-[1.7]
              text-[#d7dde5]

              sm:text-[16px]
              md:text-[17px]
              lg:text-[18px]
            "
            >
              {contactData.description}
            </p>
          </div>
        </div>
      </section>
      {/* Contact Form Section */}
      <section className="w-full bg-white font-sans">
        <div
          className="
      mx-auto
      grid
      w-full
      max-w-[1180px]
      grid-cols-1
      gap-10

      px-5
      py-14

      sm:px-6
      sm:py-16

      md:px-8
      md:py-20

      lg:grid-cols-[minmax(0,2fr)_360px]
      lg:gap-12
      lg:px-10
      lg:py-24

      xl:gap-14
      xl:px-12

      2xl:px-0
    "
        >
          {/* Left Side - Inquiry Form */}
          <div className="w-full">
            {/* Heading */}
            <h2
              className="
          text-[24px]
          font-bold
          tracking-[-0.02em]
          text-[#081426]

          sm:text-[26px]
          md:text-[28px]
          lg:text-[30px]
        "
            >
              Inquiry Form
            </h2>

            <p
              className="
          mt-2
          max-w-[760px]
          text-[14px]
          font-normal
          leading-[1.6]
          text-[#7a8290]

          sm:text-[15px]
          md:text-[16px]
        "
            >
              Please complete the formal request below. All scientific inquiries are
              reviewed within 24 business hours.
            </p>

            {/* Form */}
            <form
              className="
          mt-8
          grid
          grid-cols-1
          gap-x-5
          gap-y-5

          md:grid-cols-2
        "
            >
              {/* Full Name */}
              <div className="w-full">
                <label
                  htmlFor="fullName"
                  className="
              mb-2
              block
              text-[14px]
              font-semibold
              text-[#111827]

              sm:text-[15px]
            "
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  className="
              h-[50px]
              w-full
              rounded-[7px]
              border
              border-[#dfe3e8]
              bg-[#f8f9fb]
              px-4
              text-[15px]
              text-[#1f2937]
              outline-none
              transition-all
              duration-200

              focus:border-[#258fe8]
              focus:bg-white
              focus:ring-2
              focus:ring-[#258fe8]/10

              sm:h-[52px]
            "
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="
              mb-2
              block
              text-[14px]
              font-semibold
              text-[#111827]

              sm:text-[15px]
            "
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  className="
              h-[50px]
              w-full
              rounded-[7px]
              border
              border-[#dfe3e8]
              bg-[#f8f9fb]
              px-4
              text-[15px]
              text-[#1f2937]
              outline-none
              transition-all
              duration-200

              focus:border-[#258fe8]
              focus:bg-white
              focus:ring-2
              focus:ring-[#258fe8]/10

              sm:h-[52px]
            "
                />
              </div>

              {/* Subject */}
              <div className="md:col-span-2">
                <label
                  htmlFor="subject"
                  className="
              mb-2
              block
              text-[14px]
              font-semibold
              text-[#111827]

              sm:text-[15px]
            "
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  className="
              h-[50px]
              w-full
              rounded-[7px]
              border
              border-[#dfe3e8]
              bg-[#f8f9fb]
              px-4
              text-[15px]
              text-[#1f2937]
              outline-none
              transition-all
              duration-200

              focus:border-[#258fe8]
              focus:bg-white
              focus:ring-2
              focus:ring-[#258fe8]/10

              sm:h-[52px]
            "
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="
              mb-2
              block
              text-[14px]
              font-semibold
              text-[#111827]

              sm:text-[15px]
            "
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={7}
                  className="
              min-h-[160px]
              w-full
              resize-y
              rounded-[7px]
              border
              border-[#dfe3e8]
              bg-[#f8f9fb]
              px-4
              py-3
              text-[15px]
              text-[#1f2937]
              outline-none
              transition-all
              duration-200

              focus:border-[#258fe8]
              focus:bg-white
              focus:ring-2
              focus:ring-[#258fe8]/10

              sm:min-h-[180px]
              lg:min-h-[190px]
            "
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="
              mt-1
              inline-flex
              h-[50px]
              min-w-[175px]
              items-center
              justify-center
              rounded-[6px]
              bg-[#213e69]
              px-7
              text-[15px]
              font-bold
              text-white
              transition-all
              duration-300

              hover:-translate-y-[2px]
              hover:bg-[#1b3459]
              hover:shadow-[0_8px_20px_rgba(33,62,105,0.2)]

              sm:h-[52px]
              sm:text-[16px]
            "
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Direct Support */}
          <aside
            className="
        h-fit
        w-full
        rounded-[14px]
        border
        border-[#cfe2f7]
        bg-[#f6f9fd]

        p-5

        sm:p-6
      "
          >
            {/* Card Heading */}
            <div className="flex items-center gap-3">
              <Sparkles
                size={20}
                strokeWidth={1.8}
                className="text-[#087fda]"
              />

              <h3
                className="
            text-[16px]
            font-bold
            text-[#10182b]

            sm:text-[17px]
          "
              >
                Direct Support Channels
              </h3>
            </div>

            <div className="my-5 h-px w-full bg-[#dfe6ee]" />

            {/* Product Inquiries */}
            <div className="flex items-start gap-4">
              <div
                className="
            flex
            h-[40px]
            w-[40px]
            shrink-0
            items-center
            justify-center
            rounded-[8px]
            bg-white
          "
              >
                <FlaskConical
                  size={22}
                  strokeWidth={1.8}
                  className="text-[#1989d5]"
                />
              </div>

              <div>
                <p
                  className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#9ba3b1]

              sm:text-[12px]
            "
                >
                  Product Inquiries
                </p>

                <a
                  href="#"
                  className="
              mt-1
              inline-block
              text-[14px]
              font-normal
              text-[#2690ff]
              transition-colors
              hover:text-[#126ec5]

              sm:text-[15px]
            "
                >
                  Use the inquiry form
                </a>
              </div>
            </div>

            {/* Order Support */}
            <div className="mt-6 flex items-start gap-4">
              <div
                className="
            flex
            h-[40px]
            w-[40px]
            shrink-0
            items-center
            justify-center
            rounded-[8px]
            bg-white
          "
              >
                <ShoppingCart
                  size={22}
                  strokeWidth={1.8}
                  className="text-[#1989d5]"
                />
              </div>

              <div>
                <p
                  className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#9ba3b1]

              sm:text-[12px]
            "
                >
                  Order Support
                </p>

                <a
                  href="#"
                  className="
              mt-1
              inline-block
              text-[14px]
              font-normal
              text-[#2690ff]
              transition-colors
              hover:text-[#126ec5]

              sm:text-[15px]
            "
                >
                  Contact order support
                </a>
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div className="mt-6 flex items-start gap-4">
              <div
                className="
            flex
            h-[40px]
            w-[40px]
            shrink-0
            items-center
            justify-center
            rounded-[8px]
            bg-white
          "
              >
                <MessageCircle
                  size={22}
                  strokeWidth={1.8}
                  className="text-[#10c96f]"
                />
              </div>

              <div>
                <p
                  className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#9ba3b1]

              sm:text-[12px]
            "
                >
                  Phone &amp; WhatsApp
                </p>

                <a
                  href="tel:+18564040353"
                  className="
              mt-1
              inline-block
              text-[14px]
              font-normal
              text-[#2690ff]
              transition-colors
              hover:text-[#126ec5]

              sm:text-[15px]
            "
                >
                  +1 (856) 404-0353
                </a>

                <p
                  className="
              mt-1
              max-w-[260px]
              text-[13px]
              leading-[1.5]
              text-[#9aa3b2]

              sm:text-[14px]
            "
                >
                  Please don&apos;t call directly — message us on WhatsApp for the
                  fastest response.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Contact;