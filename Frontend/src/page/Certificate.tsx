import React from "react";

const Certificate = () => {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center bg-white px-5 py-16 font-sans sm:px-6 md:px-8 lg:px-10">
      <section className="w-full max-w-[900px] text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#17182a] sm:text-[38px] md:text-[44px]">
          Certificates of Analysis
        </h1>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          A Certificate of Analysis (COA) documents the laboratory results for a specific product batch, including identity and purity as measured by HPLC.
        </p>

        <div className="mx-auto mt-8 max-w-[820px] space-y-5 text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          <p>COAs are available for current product batches.</p>
          <p>Each COA lists the product, lot number, test date, and testing laboratory.</p>
          <p>To request the COA for a product you purchased, contact support with your order number and the lot number printed on the label.</p>
        </div>
      </section>
    </main>
  );
};

export default Certificate;
