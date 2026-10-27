import React from "react";

const Third = () => {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center bg-white px-5 py-16 font-sans sm:px-6 md:px-8 lg:px-10">
      <section className="w-full max-w-[900px] text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#17182a] sm:text-[38px] md:text-[44px]">
          Third-Party Testing
        </h1>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          We do not test our own products in-house and call it verification. Every batch is sent to an independent, accredited analytical laboratory.
        </p>

        <div className="mx-auto mt-8 max-w-[820px] space-y-5 text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          <p><strong className="text-[#27364a]">HPLC analysis</strong> confirms identity and purity of each batch.</p>
          <p><strong className="text-[#27364a]">Independent laboratories</strong> — testing partners are unaffiliated with our manufacturing partners.</p>
          <p><strong className="text-[#27364a]">Batch-level results</strong> — results are tied to specific lot numbers, not generic product claims.</p>
        </div>

        <p className="mx-auto mt-8 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          Testing results for the applicable batch are summarized on the Certificate of Analysis.
        </p>
      </section>
    </main>
  );
};

export default Third;
