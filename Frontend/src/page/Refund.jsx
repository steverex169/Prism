import React from "react";
import PolicyLayout from "../component/PolicyLayout.jsx";

const Refund = () => {
    const refundSections = [
        {
            id: "1",
            number: 1,
            title: "All Sales Are Final",
            paragraphs: [
                "All purchases made through Prisim Wellness are final sale.",
                "We do not offer refunds, returns, exchanges, or cancellations once an order has been placed, processed, or shipped, except where required by law or approved by Prisim Wellness in writing.",
            ],
        },

        {
            id: "2",
            number: 2,
            title: "No Returns or Exchanges",
            paragraphs: [
                "We cannot accept returned products, including sealed, unopened, unused, or partially used items.",
                "This policy is in place for product integrity, safety, quality control, and compliance reasons.",
            ],
        },

        {
            id: "3",
            number: 3,
            title: "Order Accuracy",
            paragraphs: [
                "Customers are responsible for reviewing all order details before completing checkout, including product selection, quantity, shipping address, billing information, and contact details.",
                "Prisim Wellness is not responsible for customer errors entered at checkout.",
            ],
        },

        {
            id: "4",
            number: 4,
            title: "Damaged, Missing, or Incorrect Orders",
            paragraphs: [
                "If your order arrives damaged, missing an item, or contains the wrong item, please contact us within 48 hours of delivery.",
                "Please include your order number, photos of the package, photos of the product, photos of the shipping label, and a brief description of the issue.",
                "After review, Prisim Wellness may offer a replacement, store credit, or another resolution at our sole discretion.",
            ],
        },

        {
            id: "5",
            number: 5,
            title: "Shipping Issues",
            paragraphs: [
                "Prisim Wellness is not responsible for delays, lost packages, stolen packages, refused deliveries, customs delays, incorrect addresses, carrier issues, or events outside our control.",
                "Once an order is given to the shipping carrier, delivery timing and handling are controlled by the carrier.",
            ],
        },

        {
            id: "6",
            number: 6,
            title: "Refused or Returned Packages",
            paragraphs: [
                "If a package is refused, unclaimed, returned to sender, or undeliverable due to customer error, Prisim Wellness is not required to issue a refund or replacement.",
            ],
        },

        {
            id: "7",
            number: 7,
            title: "Chargebacks",
            paragraphs: [
                "By placing an order, you agree not to file improper chargebacks for orders fulfilled according to this policy.",
                "Prisim Wellness reserves the right to dispute chargebacks and provide order records, delivery confirmation, and policy acceptance proof to payment providers.",
            ],
        },

        {
            id: "8",
            number: 8,
            title: "Contact",
            paragraphs: [
                "For questions about this Refund & Return Policy or to report a damaged, missing, or incorrect order, contact us at:",
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
            bannerHighlight="Refund"
            bannerTitle="& Return Policy"
            overviewLabel="Policy Overview"
            overviewParagraphs={[
                "At Prisim Wellness, all orders are handled with care. Due to the nature of our products, we maintain a strict final sale policy.",
                "By using our website, you agree to this Refund & Return Policy."
            ]}
            sections={refundSections}
        />
    );
};

export default Refund;