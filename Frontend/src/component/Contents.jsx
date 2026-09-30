// Contents.jsx

import React from "react";

const Contents = ({ items = [], activeId = null }) => {
  const handleClick = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <aside
      className="
    w-full
    rounded-[14px]
    border
    border-[#e0e4e8]
    bg-white
    p-5
    font-sans

    md:max-w-[280px]
    lg:max-w-[300px]
  "
    >
      <h3
        className="
          text-[12px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-[#566173]
        "
      >
        Contents
      </h3>

<div
  className="
    mt-5
    flex
    flex-col
    gap-1
    pr-2

    lg:max-h-[calc(100vh-150px)]
    lg:overflow-y-auto

    scrollbar-thin
  "
>
        {items.map((item, index) => {
          const number = item.number ?? index + 1;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`
                group
                flex
                w-full
                items-start
                gap-4
                rounded-[7px]
                px-2
                py-2
                text-left
                transition-colors
                duration-200

                ${isActive
                  ? "bg-[#f3f7fc]"
                  : "hover:bg-[#f7f9fc]"
                }
              `}
            >
              <span
                className="
                  min-w-[22px]
                  pt-[1px]
                  text-[14px]
                  font-semibold
                  text-[#1294ff]
                "
              >
                {number}
              </span>

              <span
                className="
                  text-[14px]
                  font-normal
                  leading-[1.45]
                  text-[#303746]

                  sm:text-[15px]
                "
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Contents;