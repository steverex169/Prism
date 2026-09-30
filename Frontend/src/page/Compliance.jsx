import React from "react";

const Compliance = () => {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center bg-white px-5 py-16 font-sans sm:px-6 md:px-8 lg:px-10">
      <section className="w-full max-w-[900px] text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#17182a] sm:text-[38px] md:text-[44px]">
          Compliance Statement
        </h1>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] font-semibold leading-[1.9] text-[#27364a] sm:text-[16px]">
          All products sold on this website are for laboratory research use only. Not for human or veterinary use.
        </p>

        <p className="mx-auto mt-4 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          They are not intended for ingestion, injection, clinical or diagnostic use, or any other in-vivo application, and they are not drugs, foods, cosmetics, or dietary supplements.
        </p>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          Products are sold exclusively to qualified researchers and laboratory professionals. Every order requires the buyer to attest at checkout that the purchase is solely for laboratory research. Customers are responsible for safe handling and for ensuring compliance with the laws and regulations that apply to their research.
        </p>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          Product descriptions describe composition, specifications, and testing — they are not usage recommendations. For questions about an order or a product specification, contact our support.
        </p>
      </section>
    </main>
  );
};

export default Compliance;
