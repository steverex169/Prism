// PolicyLayout.jsx

import React from "react";
import Contents from "./Contents";

const PolicyLayout = ({
  bannerTitle = "",
  bannerHighlight = "",
  overviewLabel = "",
  overviewParagraphs = [],
  sections = [],
}) => {
  return (
    <>
      {/* Top Banner */}
      <section className="w-full bg-[#06192c] font-sans">
        <div
          className="
            mx-auto
            flex
            min-h-[145px]
            w-full
            max-w-[1180px]
            items-center
            justify-center
            px-5
            py-10
            sm:px-6
            sm:py-12
            md:px-8
            lg:px-10
            xl:px-12
            2xl:px-0
          "
        >
          <h1
            className="
              text-center
              text-[34px]
              font-bold
              leading-tight
              tracking-[-0.03em]
              text-white
              sm:text-[40px]
              md:text-[46px]
              lg:text-[52px]
            "
          >
            {bannerHighlight && (
              <span className="text-[#1294ff]">
                {bannerHighlight}
              </span>
            )}

            {bannerHighlight && bannerTitle ? " " : ""}

            {bannerTitle}
          </h1>
        </div>
      </section>

      {/* Overview Banner */}
      {overviewParagraphs.length > 0 && (
        <section className="w-full bg-white font-sans">
          <div
            className="
              mx-auto
              w-full
              max-w-[1180px]
              px-5
              pt-10
              sm:px-6
              sm:pt-12
              md:px-8
              md:pt-14
              lg:px-10
              lg:pt-16
              xl:px-12
              2xl:px-0
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[8px]
                border
                border-[#dbe6f2]
                bg-[#f5f9fd]
                px-5
                py-6
                sm:px-6
                sm:py-7
                md:px-7
                md:py-8
                lg:px-8
              "
            >
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  top-0
                  w-[3px]
                  bg-[#1294ff]
                  sm:w-[4px]
                "
              />

              {overviewLabel && (
                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#178cff]
                    sm:text-[12px]
                    md:text-[13px]
                  "
                >
                  {overviewLabel}
                </p>
              )}

              {overviewParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="
                    mt-4
                    text-[15px]
                    font-normal
                    leading-[1.8]
                    text-[#27364a]
                    sm:text-[16px]
                    md:text-[17px]
                  "
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sidebar + Main Content */}
      <section className="w-full bg-white font-sans">
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1180px]
            grid-cols-1
            items-start
            gap-8
            px-5
            py-12

            sm:px-6
            sm:py-14

            md:px-8
            md:py-16

            lg:grid-cols-[300px_minmax(0,1fr)]
            lg:gap-12
            lg:px-10
            lg:py-20

            xl:px-12
            2xl:px-0
          "
        >
          {/* Sidebar */}
          <div
            className="
              w-full
              lg:sticky
              lg:top-[90px]
              lg:self-start
              lg:h-fit
            "
          >
            <Contents items={sections} />
          </div>

          {/* Dynamic Right Content */}
          <div className="w-full min-w-0">
            {sections.map((section, sectionIndex) => (
              <section
                key={section.id}
                id={section.id}
                className={`
                  scroll-mt-[130px]
                  border-b
                  border-[#e5e7eb]
                  ${sectionIndex === 0 ? "pb-8" : "py-8"}
                `}
              >
                {/* Heading */}
                <h2
                  className="
                    text-[20px]
                    font-bold
                    leading-[1.35]
                    text-[#17182a]
                    sm:text-[21px]
                    md:text-[22px]
                  "
                >
                  {section.number !== undefined &&
                    section.number !== null &&
                    `${section.number}. `}

                  {section.title}
                </h2>

                {/* Accent */}
                <div className="mt-2 h-[2px] w-[32px] bg-[#1294ff]" />

                {/* Paragraphs */}
                {section.paragraphs?.map((paragraph, index) => (
                  <p
                    key={index}
                    className="
                      mt-3
                      text-[15px]
                      font-normal
                      leading-[1.8]
                      text-[#697181]
                      sm:text-[16px]
                    "
                  >
                    {paragraph}
                  </p>
                ))}

                {/* Numbered list */}
                {section.list && (
                  <ol
                    className="
                      mt-4
                      list-decimal
                      space-y-2
                      pl-8
                      text-[15px]
                      leading-[1.7]
                      text-[#697181]
                      marker:font-semibold
                      marker:text-[#1294ff]
                      sm:text-[16px]
                    "
                  >
                    {section.list.map((item, index) => (
                      <li key={index} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ol>
                )}

                {/* Extra paragraphs after list */}
                {section.after?.map((paragraph, index) => (
                  <p
                    key={index}
                    className="
                      mt-4
                      text-[15px]
                      font-normal
                      leading-[1.8]
                      text-[#697181]
                      sm:text-[16px]
                    "
                  >
                    {paragraph}
                  </p>
                ))}

                {/* Custom JSX block if needed */}
                {section.customContent && (
                  <div className="mt-4">
                    {section.customContent}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PolicyLayout;