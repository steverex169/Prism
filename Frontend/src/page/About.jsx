// About.jsx

import React, { useEffect, useRef, useState } from "react";
import {
  Clock3,
  Microscope,
  UsersRound,
  FlaskConical,
} from "lucide-react";

import missionImage from "../assets/missionImage.webp";
import aboutHeroImage from "../assets/becon.jpg";

const About = () => {
  const aboutData = {
    backgroundImage: aboutHeroImage,

    badgeText: "OUR STORY",

    titleLine1: "Premium Research",
    titleLine2: "Peptides,",
    titleHighlight1: "Backed by Real",
    titleHighlight2: "Standards",

    description:
      "Prism Wellness supplies high-purity peptides for laboratory research, with independent third-party HPLC testing on every batch.",
  };

  const missionData = {
    image: missionImage,

    title: "Our Mission",

    paragraph1:
      "Our mission is simple: give researchers and laboratories materials they can actually rely on — rigorously tested, honestly described, and never overpromised.",

    paragraph2:
      "Every batch we ship is HPLC-tested and held to strict standards for identity and purity, so you know exactly what's in each container.",

    points: [
      "Advancing peptide science through accessible, high-purity products.",
      "Maintaining 100% transparency in chemical analysis and sourcing.",
      "Backing every product with third-party lab testing and clear documentation.",
    ],
  };

  const missionRef = useRef(null);
  const [missionVisible, setMissionVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMissionVisible(true);
        }
      },
      {
        threshold: 0.18,
      }
    );

    if (missionRef.current) {
      observer.observe(missionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        className="
        relative
        flex
        min-h-[420px]
        w-full
        items-center
        overflow-hidden
        bg-[#07172a]
        bg-cover
        bg-center
        bg-no-repeat
        font-sans

        sm:min-h-[460px]
        md:min-h-[500px]
        lg:min-h-[540px]
        xl:min-h-[570px]
      "
        style={{
          backgroundImage: `url(${aboutData.backgroundImage})`,
        }}
      >
        {/* Left-to-right navy/blue overlay */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-gradient-to-r
          from-[#041326]/100
          via-[#061b31]/100
          to-[#0a3453]/60
        "
        />

        {/* Extra blue tint toward right */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-transparent
          via-[#0a2b45]/10
          to-[#0a2b45]/40
        "
        />

        {/* Grid Overlay */}
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
        "
          style={{
            backgroundImage: `
            linear-gradient(rgba(63, 122, 161, 0.11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(63, 122, 161, 0.11) 1px, transparent 1px)
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
          py-14

          sm:px-6
          sm:py-16

          md:px-8
          md:py-20

          lg:px-10
          lg:py-24

          xl:px-12

          2xl:px-0
        "
        >
          <div
            className="
            w-full
            max-w-[720px]

            sm:max-w-[760px]
            md:max-w-[820px]
            lg:max-w-[900px]
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
              <FlaskConical size={13} strokeWidth={1.8} />

              {aboutData.badgeText}
            </div>

            {/* Main Heading */}
            <h1
              className="
              mt-5
              max-w-[900px]

              text-[38px]
              font-bold
              leading-[1.03]
              tracking-[-0.035em]
              text-white

              sm:text-[46px]
              md:text-[56px]
              lg:text-[64px]
              xl:text-[70px]
            "
            >
              <span className="block">
                {aboutData.titleLine1}
              </span>

              <span className="block">
                {aboutData.titleLine2}{" "}
                <span className="text-[#087ef5]">
                  {aboutData.titleHighlight1}
                </span>
              </span>

              <span className="block text-[#087ef5]">
                {aboutData.titleHighlight2}
              </span>
            </h1>

            {/* Description */}
            <p
              className="
              mt-6
              max-w-[560px]

              text-[15px]
              font-normal
              leading-[1.7]
              text-[#d7dde5]

              sm:text-[16px]
              md:text-[17px]
              lg:text-[18px]
            "
            >
              {aboutData.description}
            </p>
          </div>
        </div>
      </section>
      {/* About Company Section */}
      <section className="w-full bg-white font-sans">
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
          <div className="mx-auto max-w-[900px] text-center">

            {/* Small Heading */}
            <p
              className="
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[#178cff]

          sm:text-[12px]
          md:text-[13px]
        "
            >
              About Our Company
            </p>

            {/* Main Heading */}
            <h2
              className="
          mt-4
          text-[34px]
          font-bold
          leading-[1.08]
          tracking-[-0.03em]
          text-[#111323]

          sm:text-[40px]
          md:text-[46px]
          lg:text-[52px]
          xl:text-[56px]
        "
            >
              Committed to{" "}
              <span className="text-[#157cf6]">
                Documented Quality
              </span>

              <span className="block">
                You Can Trust
              </span>
            </h2>

            {/* First Paragraph */}
            <p
              className="
          mx-auto
          mt-8
          max-w-[850px]

          text-[15px]
          font-normal
          leading-[1.75]
          text-[#737985]

          sm:text-[16px]
          md:text-[17px]
          lg:text-[18px]
        "
            >
              Prism Wellness makes it simple to source high-purity research materials
              you can trust. We work only with vetted, GMP-compliant manufacturing
              partners, and every batch is HPLC-tested by an independent laboratory
              for identity and purity before it ships.
            </p>

            {/* Second Paragraph */}
            <p
              className="
          mx-auto
          mt-4
          max-w-[850px]

          text-[15px]
          font-normal
          leading-[1.75]
          text-[#737985]

          sm:text-[16px]
          md:text-[17px]
          lg:text-[18px]
        "
            >
              Our model is straightforward: source from vetted, accredited partners,
              test every batch, and be transparent about what&apos;s actually in the vial
              — then get it to you quickly with reliable US shipping.
            </p>
          </div>
        </div>
      </section>
      {/* Mission Section */}
      <section
        ref={missionRef}
        className="
    w-full
    overflow-hidden
    bg-[#f6f8fb]
    font-sans
  "
      >
        <div
          className="
      mx-auto
      grid
      w-full
      max-w-[1180px]
      grid-cols-1
      items-center

      gap-10
      px-5
      py-14

      sm:px-6
      sm:py-16

      md:grid-cols-2
      md:gap-12
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
          <div
            className={`
        w-full
        transition-all
        duration-1000
        ease-out

        ${missionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-[55px] opacity-0"
              }
      `}
          >
            <div
              className="
          mx-auto
          w-full
          max-w-[520px]

          rounded-[14px]
          bg-white

          p-3
          sm:p-4
          md:p-5

          shadow-[0_18px_45px_rgba(25,44,70,0.10)]
        "
            >
              <div
                className="
            overflow-hidden
            rounded-[5px]
          "
              >
                <img
                  src={missionData.image}
                  alt="Our mission"
                  className="
              h-[300px]
              w-full
              object-cover

              transition-transform
              duration-[1400ms]
              ease-out

              sm:h-[360px]
              md:h-[400px]
              lg:h-[420px]

              hover:scale-[1.025]
            "
                />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div
            className={`
        w-full

        transition-all
        duration-1000
        delay-150
        ease-out

        ${missionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-[70px] opacity-0"
              }
      `}
          >
            {/* Heading */}
            <h2
              className="
          text-[34px]
          font-bold
          leading-[1.1]
          tracking-[-0.03em]
          text-[#191a2b]

          sm:text-[38px]
          md:text-[40px]
          lg:text-[44px]
          xl:text-[46px]
        "
            >
              {missionData.title}
            </h2>

            {/* Paragraph 1 */}
            <p
              className="
          mt-6
          max-w-[560px]

          text-[15px]
          font-normal
          leading-[1.75]
          text-[#777f90]

          sm:text-[16px]
          md:text-[17px]
          lg:text-[18px]
        "
            >
              {missionData.paragraph1}
            </p>

            {/* Paragraph 2 */}
            <p
              className="
          mt-5
          max-w-[560px]

          text-[15px]
          font-normal
          leading-[1.75]
          text-[#777f90]

          sm:text-[16px]
          md:text-[17px]
          lg:text-[18px]
        "
            >
              {missionData.paragraph2}
            </p>

            {/* Mission Points */}
            <div className="mt-7 flex flex-col gap-4">
              {missionData.points.map((point, index) => (
                <div
                  key={index}
                  className="
              flex
              items-start
              gap-3
            "
                >
                  {/* Check Circle */}
                  <div
                    className="
                mt-[2px]
                flex
                h-[22px]
                w-[22px]
                shrink-0
                items-center
                justify-center

                rounded-full
                bg-[#e5f5ff]

                text-[13px]
                font-bold
                text-[#25a8f2]

                sm:h-[24px]
                sm:w-[24px]
              "
                  >
                    ✓
                  </div>

                  <p
                    className="
                text-[14px]
                font-normal
                leading-[1.55]
                text-[#596274]

                sm:text-[15px]
                md:text-[16px]
                lg:text-[17px]
              "
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="w-full bg-white font-sans">
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
          {/* Heading */}
          <h2
            className="
        text-center
        text-[34px]
        font-bold
        tracking-[-0.03em]
        text-[#17182a]

        sm:text-[38px]
        md:text-[44px]
        lg:text-[50px]
      "
          >
            Why Choose Us
          </h2>

          {/* Cards */}
          <div
            className="
        mt-10
        grid
        grid-cols-1
        gap-5

        sm:mt-12
        md:grid-cols-3
        md:gap-6

        lg:mt-14
      "
          >
            {/* Card 1 */}
            <div
              className="
          flex
          min-h-[210px]
          flex-col
          items-center
          justify-center
          rounded-[12px]
          border
          border-[#e1e5ea]
          bg-white
          px-6
          py-8
          text-center

          shadow-[0_10px_30px_rgba(15,23,42,0.05)]

          transition-all
          duration-300

          hover:-translate-y-[4px]
          hover:shadow-[0_16px_38px_rgba(15,23,42,0.10)]
        "
            >
              <Clock3
                size={48}
                strokeWidth={1.8}
                className="text-[#24395d]"
              />

              <h3
                className="
            mt-5
            text-[18px]
            font-bold
            text-[#1c1d2d]

            sm:text-[19px]
            lg:text-[20px]
          "
              >
                24/7 Support
              </h3>

              <p
                className="
            mt-3
            max-w-[260px]
            text-[14px]
            font-normal
            leading-[1.6]
            text-[#7b8494]

            sm:text-[15px]
          "
              >
                Reach our team any time with questions about your order or products.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="
          flex
          min-h-[210px]
          flex-col
          items-center
          justify-center
          rounded-[12px]
          border
          border-[#e1e5ea]
          bg-white
          px-6
          py-8
          text-center

          shadow-[0_10px_30px_rgba(15,23,42,0.05)]

          transition-all
          duration-300

          hover:-translate-y-[4px]
          hover:shadow-[0_16px_38px_rgba(15,23,42,0.10)]
        "
            >
              <Microscope
                size={48}
                strokeWidth={1.8}
                className="text-[#24395d]"
              />

              <h3
                className="
            mt-5
            text-[18px]
            font-bold
            text-[#1c1d2d]

            sm:text-[19px]
            lg:text-[20px]
          "
              >
                Quality Lab Testing
              </h3>

              <p
                className="
            mt-3
            max-w-[270px]
            text-[14px]
            font-normal
            leading-[1.6]
            text-[#7b8494]

            sm:text-[15px]
          "
              >
                Every batch is checked by accredited third-party labs before it ships.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="
          flex
          min-h-[210px]
          flex-col
          items-center
          justify-center
          rounded-[12px]
          border
          border-[#e1e5ea]
          bg-white
          px-6
          py-8
          text-center

          shadow-[0_10px_30px_rgba(15,23,42,0.05)]

          transition-all
          duration-300

          hover:-translate-y-[4px]
          hover:shadow-[0_16px_38px_rgba(15,23,42,0.10)]
        "
            >
              <UsersRound
                size={48}
                strokeWidth={1.8}
                className="text-[#24395d]"
              />

              <h3
                className="
            mt-5
            text-[18px]
            font-bold
            text-[#1c1d2d]

            sm:text-[19px]
            lg:text-[20px]
          "
              >
                Order Help
              </h3>

              <p
                className="
            mt-3
            max-w-[260px]
            text-[14px]
            font-normal
            leading-[1.6]
            text-[#7b8494]

            sm:text-[15px]
          "
              >
                Not sure what to pick? Message us any time, no obligation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;