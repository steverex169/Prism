import React, { useState } from "react";
import Header from "../component/Header";
import heroImage from "../assets/bgImg.jpg";
import prismQuality from "../assets/prisim-quality.webp";
import { Plus, X } from "lucide-react";
import Footer from "../component/Footer";

const Main_page = () => {
  const heroData = {
    backgroundImage: heroImage,

    titleLine1: "Science-Driven",
    titleLine2: "Peptide",
    highlightedTitle: "Solutions",

    description:
      "We provide third-party tested research peptides manufactured to strict quality and purity standards.",

    buttonText: "View Products",
    buttonLink: "#products",
  };

  const aboutData = {
    image: prismQuality,
    badge: "QUALITY ASSURANCE",
    preTitle: "DEPENDABLE PRODUCTS",
    titleLine1: "Science-driven",
    titleLine2: "solutions.",
    description:
      "High-quality peptide compounds designed with precision, purity, and innovation for scientific and laboratory applications.",
    buttonText: "About Us",
    buttonLink: "#about",
  };

  const faqData = [
    {
      question: "What exactly is a peptide?",
      answer:
        "Peptides are short chains of amino acids widely studied in scientific research across multiple fields.",
    },
    {
      question: "What is the difference between lyophilized and liquid formats?",
      answer:
        "Lyophilized peptides are provided in a dry, freeze-dried form, while liquid formats are already prepared in solution.",
    },
    {
      question: "How are your products tested for quality?",
      answer:
        "Products are evaluated using documented quality-control processes and third-party laboratory testing where applicable.",
    },
    {
      question: "How long does shipping take and is cold-pack packaging available?",
      answer:
        "Shipping times depend on the selected shipping method. Available packaging options can be shown during ordering.",
    },
  ];

  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <>
      <section
        className="
          relative
          flex
          min-h-[520px]
          w-full
          items-center
          overflow-hidden
          bg-no-repeat
          font-sans

          bg-[length:auto_100%]
          bg-[position:65%_center]

          sm:min-h-[540px]
          sm:bg-[length:auto_105%]
          sm:bg-[position:62%_center]

          md:min-h-[580px]
          md:bg-[length:auto_110%]
          md:bg-[position:60%_center]

          lg:min-h-[620px]
          lg:bg-[length:1600px_620px]
          lg:bg-center

          xl:min-h-[650px]
          xl:bg-[length:1800px_750px]

          2xl:bg-[length:1920px_750px]
        "
        style={{
          backgroundImage: `url(${heroData.backgroundImage})`,
        }}
      >
        {/* Background Image Overlay */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#031522]/35"></div>

        {/* Hero Content */}
        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1280px]

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

              sm:max-w-[580px]
              md:max-w-[650px]
              lg:max-w-[700px]
              xl:max-w-[720px]
            "
          >
            {/* Heading */}
            <h1
              className="
                m-0
                p-0
                text-left
                font-normal
                tracking-[-0.02em]
                text-[#fff7dc]
              "
            >
              <span
                className="
                  block
                  text-[38px]
                  leading-[1.08]

                  sm:text-[46px]
                  md:text-[58px]
                  lg:text-[72px]
                  xl:text-[82px]
                  2xl:text-8xl
                "
              >
                {heroData.titleLine1}
              </span>

              <span
                className="
                  block
                  text-[38px]
                  leading-[1.08]

                  sm:text-[46px]
                  md:text-[58px]
                  lg:text-[72px]
                  xl:text-[82px]
                  2xl:text-8xl
                "
              >
                {heroData.titleLine2}
              </span>

              <span
                className="
                  block
                  text-[38px]
                  leading-[1.08]
                  text-[#0089d6]

                  sm:text-[46px]
                  md:text-[58px]
                  lg:text-[72px]
                  xl:text-[82px]
                  2xl:text-8xl
                "
              >
                {heroData.highlightedTitle}
              </span>
            </h1>

            {/* Paragraph */}
            <p
              className="
                mt-6
                max-w-[440px]
                text-[15px]
                font-normal
                leading-[1.7]
                text-gray-300

                sm:mt-7
                sm:max-w-[500px]
                sm:text-[16px]

                md:max-w-[560px]
                md:text-[17px]

                lg:mt-8
                lg:max-w-[600px]
                lg:text-[20px]

                xl:text-[22px]

                2xl:text-3xl
              "
            >
              {heroData.description}
            </p>

            {/* CTA */}
            <a
              href={heroData.buttonLink}
              className="
                relative
                mt-6
                inline-flex
                h-[50px]
                w-[190px]
                items-center
                justify-center

                bg-gradient-to-r
                from-[#00509b]
                to-[#0089d6]

                text-[16px]
                font-bold
                text-white

                transition-all
                duration-400
                ease-out

                hover:-translate-y-[3px]

                after:absolute
                after:left-1/2
                after:-bottom-[8px]
                after:h-[18px]
                after:w-[70%]
                after:-translate-x-1/2
                after:rounded-full
                after:bg-[#00a8f3]/25
                after:blur-[18px]
                after:opacity-30
                after:content-['']

                hover:after:-bottom-[10px]
                hover:after:h-[24px]
                hover:after:w-[78%]
                hover:after:bg-[#00b7ff]/35
                hover:after:blur-[22px]
                hover:after:opacity-60

                sm:mt-7
                sm:h-[52px]
                sm:w-[210px]
                sm:text-[18px]

                md:h-[55px]
                md:w-[225px]
                md:text-[20px]

                lg:mt-[28px]
                lg:h-[58px]
                lg:w-[250px]
                lg:text-[24px]

                xl:text-[26px]

                2xl:text-3xl
              "
            >
              {heroData.buttonText}
            </a>
          </div>
        </div>
      </section>
      {/* Quality Standards Section */}
      <section className="w-full bg-[#fff0df]">
        <div
          className="
      mx-auto
      flex
      w-full
      max-w-7xl
      flex-col
      items-center
      justify-center

      px-5
      py-4

      sm:px-6
      sm:py-5

      md:flex-row
      md:flex-wrap
      md:gap-x-5
      md:gap-y-2

      lg:flex-nowrap
      lg:gap-6

      xl:px-0
    "
        >
          <p
            className="
        text-center
        text-[13px]
        font-semibold
        uppercase
        tracking-[0.08em]
        text-[#0d3655]

        sm:text-[14px]
        md:text-[16px]
        lg:text-[18px]
        xl:text-[20px]
        2xl:text-[24px]
      "
          >
            Third-Party Tested
          </p>

          <span
            className="
        hidden
        font-bold
        text-[#029cc8]

        md:inline-block
        md:text-[16px]
        lg:text-[18px]
        xl:text-[20px]
        2xl:text-[24px]
      "
          >
            •
          </span>

          <p
            className="
        text-center
        text-[13px]
        font-semibold
        uppercase
        tracking-[0.08em]
        text-[#0d3655]

        sm:text-[14px]
        md:text-[16px]
        lg:text-[18px]
        xl:text-[20px]
        2xl:text-[20px]
      "
          >
            Documented Quality Standards
          </p>

          <span
            className="
        hidden
        font-bold
        text-[#029cc8]

        md:inline-block
        md:text-[16px]
        lg:text-[18px]
        xl:text-[20px]
        2xl:text-[20px]
      "
          >
            •
          </span>

          <p
            className="
        text-center
        text-[13px]
        font-semibold
        uppercase
        tracking-[0.08em]
        text-[#0d3655]

        sm:text-[14px]
        md:text-[16px]
        lg:text-[18px]
        xl:text-[20px]
        2xl:text-[20px]
      "
          >
            Transparent Product Information
          </p>
        </div>
      </section>
      {/* About / Quality Assurance Section */}
      <section className="w-full bg-[#FFF4DF]">
        <div
          className="
      mx-auto
      grid
      w-full
      max-w-[1280px]
      grid-cols-1
      items-center

      gap-10
      px-5
      py-14

      sm:px-6
      sm:py-16

      md:grid-cols-2
      md:gap-10
      md:px-8
      md:py-20

      lg:gap-16
      lg:px-10
      lg:py-24

      xl:gap-20
      xl:px-12
      xl:py-28

      2xl:px-0
    "
        >
          {/* Left Image */}
          <div className="flex w-full justify-center md:justify-start">
            <div
              className="
          relative
          w-full
          max-w-[540px]
          overflow-hidden
          rounded-[22px]

          sm:max-w-[560px]
          md:max-w-[520px]
          lg:max-w-[540px]
        "
            >
              <img
                src={prismQuality}
                alt="Prism Wellness quality assurance"
                className="
            h-[360px]
            w-full
            object-cover

            sm:h-[430px]
            md:h-[480px]
            lg:h-[540px]
          "
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full">
            {/* Badge */}
            <div
              className="
          inline-flex
          items-center
          rounded-full
          border
          border-[#68c9e8]/50
          px-4
          py-2

          text-[12px]
          font-bold
          uppercase
          tracking-[0.06em]
          text-[#008dcb]

          sm:text-[13px]
          md:text-[14px]
        "
            >
              {aboutData.badge}
            </div>

            {/* Pre Title */}
            <p
              className="
          mt-5
          max-w-[470px]

          text-[30px]
          font-light
          italic
          uppercase
          leading-[1.05]
          tracking-[0.01em]
          text-[#707070]

          sm:text-[36px]
          md:text-[38px]
          lg:text-[44px]
          xl:text-[48px]
        "
            >
              {aboutData.preTitle}
            </p>

            {/* Main Heading */}
            <h2
              className="
          mt-2
          text-[38px]
          font-bold
          leading-[1.05]
          tracking-[-0.035em]
          text-[#001728]

          sm:text-[44px]
          md:text-[46px]
          lg:text-[54px]
          xl:text-[62px]
        "
            >
              <span className="block">
                {aboutData.titleLine1}
              </span>

              <span className="block">
                {aboutData.titleLine2}
              </span>
            </h2>

            {/* Description */}
            <p
              className="
          mt-6
          max-w-[590px]

          text-[16px]
          font-normal
          leading-[1.65]
          text-[#6f6f6f]

          sm:text-[17px]
          md:text-[18px]
          lg:mt-7
          lg:text-[20px]
          xl:text-[22px]
        "
            >
              {aboutData.description}
            </p>

            {/* CTA */}
            <a
              href={aboutData.buttonLink}
              className="
          mt-7
          inline-flex
          h-[50px]
          min-w-[150px]
          items-center
          justify-center

          bg-gradient-to-r
          from-[#0069d7]
          to-[#09add8]

          px-6

          text-[16px]
          font-bold
          text-white

          transition-all
          duration-300

          hover:-translate-y-[2px]
          hover:shadow-[0_8px_24px_rgba(0,153,215,0.25)]

          sm:h-[52px]
          sm:text-[17px]

          lg:mt-8
          lg:h-[56px]
          lg:min-w-[162px]
          lg:text-[18px]
        "
            >
              {aboutData.buttonText}
            </a>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="w-full bg-[#fffbea]" id="faq">
        <div
          className="
      mx-auto
      w-full
      max-w-[1180px]

      px-5
      py-14

      sm:px-6
      sm:py-16

      md:px-8
      md:py-20

      lg:px-10
      lg:py-24

      xl:px-12
      xl:py-28

      2xl:px-0
    "
        >
          {/* Section Heading */}
          <div className="max-w-[760px]">
            <p
              className="
          text-[24px]
          font-normal
          leading-tight
          text-[#929292]

          sm:text-[28px]
          md:text-[32px]
          lg:text-[36px]
        "
            >
              Frequently Asked
            </p>

            <h2
              className="
          mt-1
          text-[38px]
          font-bold
          leading-[1.05]
          tracking-[-0.03em]
          text-[#151522]

          sm:text-[44px]
          md:text-[50px]
          lg:text-[58px]
          xl:text-[62px]
        "
            >
              Questions
            </h2>

            <p
              className="
          mt-4
          max-w-[720px]
          text-[16px]
          font-normal
          leading-[1.6]
          text-[#787878]

          sm:text-[17px]
          md:text-[19px]
          lg:text-[21px]
          xl:text-[22px]
        "
            >
              Find product information about peptide formats, quality testing,
              ordering, and shipping.
            </p>
          </div>

          {/* FAQ List */}
          <div className="mt-10 w-full max-w-[760px] sm:mt-12 md:mt-14 lg:mt-16">
            {faqData.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  key={index}
                  className="border-b border-[#e8d9c5]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFaq(isOpen ? null : index)
                    }
                    className="
                flex
                w-full
                items-center
                justify-between
                gap-5
                py-5
                text-left

                sm:py-6
              "
                  >
                    <span
                      className="
                  max-w-[650px]
                  text-[17px]
                  font-semibold
                  leading-[1.35]
                  text-[#20202b]

                  sm:text-[18px]
                  md:text-[20px]
                  lg:text-[22px]
                "
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`
    flex
    h-[28px]
    w-[28px]
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    transition-all
    duration-300

    ${isOpen
                          ? "border-[#181824] bg-[#181824] text-white"
                          : "border-[#a9a9a9] bg-transparent text-[#555]"
                        }
  `}
                    >
                      {isOpen ? (
                        <X size={14} strokeWidth={2} />
                      ) : (
                        <Plus size={14} strokeWidth={2} />
                      )}
                    </span>
                  </button>

                  <div
                    className={`
                overflow-hidden
                transition-all
                duration-300
                ease-in-out

                ${isOpen
                        ? "max-h-[220px] pb-6 opacity-100"
                        : "max-h-0 pb-0 opacity-0"
                      }
              `}
                  >
                    <p
                      className="
                  max-w-[680px]
                  text-[15px]
                  font-normal
                  leading-[1.7]
                  text-[#777]

                  sm:text-[16px]
                  md:text-[17px]
                  lg:text-[19px]
                "
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Product Information & Compliance */}
      <section className="w-full bg-[#fffbea]">
        <div
          className="
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
      xl:py-24

      2xl:px-0
    "
        >
          <div
            className="
        relative
        border
        border-[#eadfcd]
        bg-[#fff4df]

        px-5
        py-6

        sm:px-6
        sm:py-7

        md:px-8
        md:py-8

        lg:px-10
        lg:py-9
      "
          >
            {/* Left Blue Accent */}
            <div
              className="
          absolute
          left-0
          top-0
          h-full
          w-[3px]
          bg-[#0078e7]

          sm:w-[4px]
        "
            />

            {/* Heading */}
            <h3
              className="
          text-[22px]
          font-bold
          leading-tight
          text-[#001b30]

          sm:text-[24px]
          md:text-[26px]
          lg:text-[28px]
          xl:text-[30px]
        "
            >
              Product Information &amp; Compliance
            </h3>

            {/* First Paragraph */}
            <p
              className="
          mt-4
          max-w-[1060px]
          text-[15px]
          font-normal
          leading-[1.65]
          text-[#6f6f6f]

          sm:text-[16px]
          md:text-[17px]
          lg:text-[18px]
          xl:text-[19px]
        "
            >
              <span className="font-bold">
                All products are for laboratory research use only. Not for human or
                veterinary use.
              </span>{" "}
              They are not intended for ingestion, injection, clinical or diagnostic
              use, or any other in-vivo application, and are not drugs, foods,
              cosmetics, or dietary supplements.
            </p>

            {/* Second Paragraph */}
            <p
              className="
          mt-3
          max-w-[1060px]
          text-[15px]
          font-normal
          leading-[1.65]
          text-[#6f6f6f]

          sm:text-[16px]
          md:text-[17px]
          lg:text-[18px]
          xl:text-[19px]
        "
            >
              Products are sold exclusively to qualified researchers and laboratory
              professionals. Customers are responsible for safe handling and for
              ensuring compliance with the laws and regulations that apply to their
              research.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Main_page;