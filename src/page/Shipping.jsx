import React from "react";
import PolicyLayout from "../component/PolicyLayout.jsx";

const Shipping = () => {
    const shippingSections = [
        {
            id: "1",
            number: 1,
            title: "Order Processing & Handling",
            paragraphs: [
                "Orders are processed and shipped within 1 business day of being placed. Business days are Monday through Friday, excluding weekends and U.S. public holidays.",
                "Orders placed on a weekend or holiday begin processing on the next business day.",
            ],
        },

        {
            id: "2",
            number: 2,
            title: "Shipping Methods & Rates",
            paragraphs: [
                "Shipping rates are flat-rate and calculated at checkout:",
            ],
            customContent: (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[620px] border-collapse overflow-hidden rounded-[10px] border border-[#dfe5ec]">
                        <thead className="bg-[#f4f7fb]">
                            <tr>
                                <th className="border-b border-[#dfe5ec] px-4 py-3 text-left text-[14px] font-semibold text-[#27364a]">
                                    Method
                                </th>
                                <th className="border-b border-[#dfe5ec] px-4 py-3 text-left text-[14px] font-semibold text-[#27364a]">
                                    Rate
                                </th>
                                <th className="border-b border-[#dfe5ec] px-4 py-3 text-left text-[14px] font-semibold text-[#27364a]">
                                    Estimated Delivery
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="border-b border-[#e5e7eb] px-4 py-3 text-[15px] text-[#697181]">
                                    Standard Shipping
                                </td>
                                <td className="border-b border-[#e5e7eb] px-4 py-3 text-[15px] text-[#697181]">
                                    $19.99
                                </td>
                                <td className="border-b border-[#e5e7eb] px-4 py-3 text-[15px] text-[#697181]">
                                    3–5 business days
                                </td>
                            </tr>

                            <tr>
                                <td className="px-4 py-3 text-[15px] text-[#697181]">
                                    Overnight Shipping
                                </td>
                                <td className="px-4 py-3 text-[15px] text-[#697181]">
                                    $75.00
                                </td>
                                <td className="px-4 py-3 text-[15px] text-[#697181]">
                                    Next business day (order by 1 PM EST)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
        },

        {
            id: "3",
            number: 3,
            title: "Order Cutoff Times",
            paragraphs: [
                "Overnight orders placed before 1:00 PM EST on a business day are shipped the same business day. Orders placed after the cutoff, or on a weekend or holiday, ship the next business day.",
            ],
        },

        {
            id: "4",
            number: 4,
            title: "Estimated Delivery Times",
            paragraphs: [
                "Delivery estimates are calculated from the date an order ships, not the date it is placed, and do not include the handling time described in Section 1.",
                "Standard Shipping typically arrives within 3–5 business days. Overnight Shipping typically arrives the next business day after dispatch. Delivery windows are estimates provided by the carrier and are not guaranteed.",
            ],
        },

        {
            id: "5",
            number: 5,
            title: "Order Tracking",
            paragraphs: [
                "Once your order ships, a tracking number is emailed to the address provided at checkout. Please allow up to 24 hours after dispatch for tracking information to update with the carrier.",
            ],
        },

        {
            id: "6",
            number: 6,
            title: "Shipping Destinations",
            paragraphs: [
                "We currently ship to addresses within the United States only. We do not ship internationally at this time.",
            ],
        },

        {
            id: "7",
            number: 7,
            title: "Packaging & Cold-Chain",
            paragraphs: [
                "All orders are shipped in discreet, unbranded packaging to protect your privacy.",
                "Temperature-sensitive products can be shipped with cold-pack protection where applicable to help preserve product integrity in transit.",
            ],
        },

        {
            id: "8",
            number: 8,
            title: "Incorrect or Incomplete Addresses",
            paragraphs: [
                "Customers are responsible for providing a complete and accurate shipping address at checkout. Prisim Wellness is not responsible for orders delayed or lost due to an incorrect or incomplete address.",
                "If an order is returned to us due to an address error, the customer may be responsible for re-shipping costs.",
            ],
        },

        {
            id: "9",
            number: 9,
            title: "Lost, Stolen, or Delayed Packages",
            paragraphs: [
                "Once an order is handed to the shipping carrier, delivery timing and handling are controlled by the carrier. Prisim Wellness is not responsible for delays, lost packages, stolen packages, refused deliveries, or other events outside our control.",
                "If your package is marked delivered but not received, please contact the carrier first, then reach out to us so we can assist.",
            ],
            customContent: (
                <p className="mt-3 text-[15px] leading-[1.8] text-[#697181] sm:text-[16px]">
                    For damaged, missing, or incorrect orders, see our{" "}
                    <a
                        href="/refund-policy"
                        className="font-medium text-[#1294ff] transition-colors hover:underline"
                    >
                        Refund & Return Policy
                    </a>
                    .
                </p>
            ),
        },

        {
            id: "10",
            number: 10,
            title: "Contact",
            paragraphs: [
                "For questions about shipping or to report a delivery issue, contact us at:",
            ],
            customContent: (
                <div
                    className="
          rounded-[8px]
          border-l-[3px]
          border-[#1294ff]
          bg-[#f4f7fb]
          px-5
          py-5
          sm:px-6
        "
                >
                    <p className="text-[15px] font-bold text-[#27364a] sm:text-[16px]">
                        Prisim Wellness
                    </p>

                    <p className="mt-1 text-[15px] text-[#697181] sm:text-[16px]">
                        <span className="font-semibold text-[#27364a]">
                            Email:
                        </span>{" "}
                        <a
                            href="/contact"
                            className="text-[#1294ff] transition-colors hover:underline"
                        >
                            our contact form
                        </a>
                    </p>

                    <p className="mt-1 text-[15px] text-[#697181] sm:text-[16px]">
                        <span className="font-semibold text-[#27364a]">
                            Website:
                        </span>{" "}
                        /pages/contact
                    </p>
                </div>
            ),
        },
    ];

    return (
        <PolicyLayout
            bannerHighlight="Shipping"
            bannerTitle="& Delivery Policy"
            overviewLabel="Policy Overview"
            overviewParagraphs={[
                "Prisim Wellness ships all orders quickly and discreetly within the United States. This policy explains our processing times, shipping options, delivery estimates, and how we handle shipping issues.",
                "By placing an order, you agree to the terms below."
            ]}
            sections={shippingSections}
        />
    );
};

export default Shipping;