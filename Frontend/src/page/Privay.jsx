import React from "react";
import PolicyLayout from "../component/PolicyLayout.jsx";

const Privacy = () => {
    const privacySections = [
        {
            id: "1",
            number: 1,
            title: "Information We Collect",
            paragraphs: [
                "We may collect personal information such as your name, email address, phone number, billing address, shipping address, order details, payment-related information, and messages you send to us.",
                "We may also collect basic website information such as your IP address, browser type, device type, pages visited, and cookies. When you submit an order, we may retain the validated network IP address associated with that checkout as part of the order record.",
            ],
        },

        {
            id: "2",
            number: 2,
            title: "How We Use Your Information",
            paragraphs: [
                "We use your information to process orders, arrange shipping, provide customer support, verify order details, prevent fraud or misuse, administer limited-use promotions, improve our website, send order updates, and comply with legal or business requirements. Promotion eligibility is primarily matched using the email address supplied at checkout; an IP address is supporting security information and is not treated as definitive proof of identity by itself.",
            ],
        },

        {
            id: "3",
            number: 3,
            title: "Payments",
            paragraphs: [
                "Payments may be processed through secure third-party payment providers. Prisim Wellness does not intentionally store full credit card details on its own servers.",
            ],
        },

        {
            id: "4",
            number: 4,
            title: "Cookies",
            paragraphs: [
                "Our website may use cookies and similar technologies to improve website performance, remember preferences, analyze traffic, and support security features. You can disable cookies through your browser settings, but some website features may not work properly.",
            ],
        },

        {
            id: "5",
            number: 5,
            title: "Sharing of Information",
            paragraphs: [
                "We may share necessary information with trusted service providers such as payment processors, shipping carriers, website hosts, email platforms, fraud prevention tools, and legal or compliance professionals.",
                "We do not sell your personal information for direct monetary payment.",
            ],
        },

        {
            id: "6",
            number: 6,
            title: "Data Protection",
            paragraphs: [
                "We take reasonable steps to protect your personal information. However, no online system is completely secure, and we cannot guarantee absolute security.",
            ],
        },

        {
            id: "7",
            number: 7,
            title: "Data Retention",
            paragraphs: [
                "We may keep your information, including order-linked promotion and network records, as long as needed to complete orders, provide support, maintain accurate promotion usage records, prevent fraud, resolve disputes, and meet legal or business obligations.",
            ],
        },

        {
            id: "8",
            number: 8,
            title: "Age Restriction",
            paragraphs: [
                "Our website is intended only for users who are 21 years of age or older. We do not knowingly collect information from anyone under 21.",
            ],
        },

        {
            id: "9",
            number: 9,
            title: "Your Rights",
            paragraphs: [
                "Depending on your location, you may have the right to request access, correction, or deletion of your personal information. To make a privacy request, contact us at:",
            ],

            customContent: (
                <p className="text-[15px] leading-[1.8] text-[#697181] sm:text-[16px]">
                    <span className="font-semibold text-[#27364a]">Email:</span>{" "}
                    <a
                        href="/contact"
                        className="text-[#1294ff] transition-colors hover:underline"
                    >
                        our contact form
                    </a>
                </p>
            ),
        },

        {
            id: "10",
            number: 10,
            title: "Third-Party Links",
            paragraphs: [
                "Our website may contain links to third-party websites. Prisim Wellness is not responsible for the privacy practices, content, or security of those websites.",
            ],
        },

        {
            id: "11",
            number: 11,
            title: "Policy Updates",
            paragraphs: [
                "We may update this Privacy Policy at any time. Any changes will be posted on this page with an updated date.",
            ],
        },

        {
            id: "12",
            number: 12,
            title: "Contact",
            paragraphs: [],
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
            bannerHighlight="Privacy"
            bannerTitle="& Policy"
            overviewLabel="Agreement Overview"
            overviewParagraphs={[
                "Prisim Wellness respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website, place an order, or contact us",
                "By using our website, you agree to this Privacy Policy."
            ]}
            sections={privacySections}
        />
    );
};

export default Privacy;