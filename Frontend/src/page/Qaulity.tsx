import React from "react";

const Qaulity = () => {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center bg-white px-5 py-16 font-sans sm:px-6 md:px-8 lg:px-10">
      <section className="w-full max-w-[900px] text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#17182a] sm:text-[38px] md:text-[44px]">
          Quality Assurance
        </h1>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          Every product we offer goes through a documented quality process before it is listed for sale.
        </p>

        <div className="mx-auto mt-8 max-w-[820px] space-y-5 text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          <p><strong className="text-[#27364a]">Sourcing</strong> — we work only with vetted, GMP-compliant manufacturing partners.</p>
          <p><strong className="text-[#27364a]">Batch testing</strong> — every batch is tested by an independent third-party laboratory for purity and identity before release.</p>
          <p><strong className="text-[#27364a]">Documentation</strong> — Certificates of Analysis are retained for each batch and available on request.</p>
          <p><strong className="text-[#27364a]">Storage and handling</strong> — products are stored under controlled conditions and shipped with cold-pack options where required.</p>
        </div>

        <p className="mx-auto mt-8 max-w-[820px] text-[15px] leading-[1.9] text-[#697181] sm:text-[16px]">
          If you have questions about our quality process, contact our support team.
        </p>
      </section>
    </main>
  );
};

export default Qaulity;
