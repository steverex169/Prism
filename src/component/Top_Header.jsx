import React from "react";

const Top_Header = () => {
  return (
    <div className="w-full bg-[#20364B] px-4 py-3 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center text-xs font-medium sm:flex-row sm:gap-6">
        <span>
          Standard Shipping <strong>$19.99</strong>
        </span>

        <span className="hidden sm:block">|</span>
        <span>
          Overnight <strong>$75</strong> (order by 1 PM EST)
        </span>

        <span className="hidden sm:block">|</span>
        <span>Third Party Lab Tested</span>
      </div>
    </div>
  );
};

export default Top_Header;