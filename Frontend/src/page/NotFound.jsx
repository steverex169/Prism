import React from "react";
import { Link } from "react-router-dom";
import { Home, FlaskConical } from "lucide-react";

const NotFound = () => {
  return (
    <main
      className="
        flex
        min-h-[520px]
        w-full
        items-center
        justify-center
        bg-white
        px-5
        py-16
      "
    >
      <div className="w-full max-w-[700px] text-center">
        {/* 404 */}
        <h1
          className="
            text-[88px]
            font-extrabold
            leading-none
            tracking-[-0.05em]
            text-[#0b82f4]

            sm:text-[100px]
            md:text-[112px]
          "
        >
          404
        </h1>

        {/* Title */}
        <h2
          className="
            mt-5
            text-[28px]
            font-bold
            tracking-[-0.03em]
            text-[#111827]

            sm:text-[30px]
          "
        >
          Page not found
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-4
            max-w-[560px]
            text-[14px]
            leading-[1.7]
            text-[#697181]

            sm:text-[15px]
          "
        >
          The page you were looking for doesn't exist or has been moved.
          Try searching our shop or head back to the homepage.
        </p>

        {/* Buttons */}
        <div
          className="
            mt-7
            flex
            flex-col
            items-center
            justify-center
            gap-3

            sm:flex-row
          "
        >
          <Link
            to="/"
            className="
              flex
              h-[48px]
              min-w-[170px]
              items-center
              justify-center
              gap-2

              rounded-[7px]

              bg-[#0b82f4]

              px-6

              text-[14px]
              font-semibold
              text-white

              transition-all
              duration-200

              hover:bg-[#0872d7]
              hover:-translate-y-[1px]
            "
          >
            <Home size={17} strokeWidth={2} />

            Back to Home
          </Link>

          <Link
            to="/catalog"
            className="
              flex
              h-[48px]
              min-w-[160px]
              items-center
              justify-center
              gap-2

              rounded-[7px]

              bg-[#f1f2f4]

              px-6

              text-[14px]
              font-semibold
              text-[#111827]

              transition-all
              duration-200

              hover:bg-[#e7e9ed]
              hover:-translate-y-[1px]
            "
          >
            <FlaskConical size={17} strokeWidth={2} />

            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;