import React from "react";
import PolicyLayout from "../component/PolicyLayout.jsx";

const TermCondition = () => {
    const termsSections = [
        {
            id: "1",
            number: 1,
            title: "Age Requirement",
            paragraphs: [
                "You must be at least 21 years of age to access this website, place an order, or purchase any product from Prisim Wellness.",
                "By using this website or placing an order, you represent and warrant that you are at least 21 years old and legally permitted to purchase the products offered on this website in your jurisdiction.",
                "Nothing on this website constitutes medical advice, and no statement should be taken as a guarantee of any particular result. Individual results may vary.",
            ],
        },
        {
            id: "2",
            number:2,
            title: "No Medical, Health, or Usage Advice",
            paragraphs: [
                "Any information provided on this website, through email, social media, product descriptions, labels, marketing materials, or customer support is for general informational and educational purposes only.",
                "You should not interpret any information from Prisim Wellness as medical advice, health advice, or instructions for personal use.",
            ],
        },
        {
            id: "3",
            number: 3,
            title: "Customer Qualifications",
            paragraphs: [
                "By purchasing from Prisim Wellness, you represent and warrant that:",
            ],
            list: [
                "You are at least 21 years old.",
                "You are legally allowed to purchase, possess, and use the products in your jurisdiction.",
                "You are qualified, trained, or properly supervised to handle the products.",
                "You understand the hazards, risks, and responsibilities associated with handling the products.",
                "You will comply with all applicable local, state, federal, and international laws and regulations.",
            ],
            after: [
                "Prisim Wellness reserves the right to request additional information to verify customer qualifications, or lawful intended use before fulfilling any order.",
            ],
        },
        {
            id: "4",
            number: 4,
            title: "Refusal, Cancellation, or Restriction of Sale",
            paragraphs: [
                "Prisim Wellness reserves the right, at its sole discretion, to refuse, cancel, limit, or restrict any order or customer account for any reason, including but not limited to:",
            ],
            list: [
                "Suspected misuse of products.",
                "Statements implying unlawful or unsafe use.",
                "Fraudulent, suspicious, or incomplete customer information.",
                "Violation of these Terms and Conditions.",
                "Legal, safety, compliance, or regulatory concerns.",
                "Orders placed by individuals under the age of 21.",
            ],
            after: [
                "If Prisim Wellness believes that a customer intends to use products for an improper, unsafe, or unlawful purpose, the order may be denied or canceled.",
            ],
        },
        {
            id: "5",
            number: 5,
            title: "Product Handling and Safety",
            paragraphs: [
                "Purchaser assumes full responsibility for safely handling, storing, and disposing of all products purchased from Prisim Wellness.",
                "Purchaser agrees to independently review and understand:",
            ],
            list: [
                "Applicable laws and regulations regarding the products.",
                "Health and safety hazards associated with the products.",
                "Proper handling and storage procedures.",
                "Industrial hygiene controls and safety precautions.",
                "Required warnings, labeling, documentation, and disposal procedures.",
            ],
            after: [
                "Prisim Wellness makes no representation that the products are sterile, safe, effective, or suitable for any particular purpose.",
            ],
        },
        {
            id: "6",
            number: 6,
            title: "Regulatory Compliance",
            paragraphs: [
                "Purchaser is solely responsible for ensuring that any product purchased from Prisim Wellness is lawful to purchase, import, possess, store, handle, use, or dispose of in the purchaser’s jurisdiction.",
                "Purchaser is also responsible for complying with any applicable laws, including but not limited to laws relating to the products, import/export controls, customs, labeling, consumer protection, health products, controlled substances, and environmental regulations.",
                "Prisim Wellness does not guarantee that products offered on this website are approved, registered, or authorized for use in every jurisdiction.",
            ],
        },
        {
            id: "7",
            number: 7,
            title: "No Medical Claims",
            paragraphs: [
                "Prisim Wellness makes no claim that any product will diagnose, treat, cure, mitigate, or prevent any disease or health condition.",
            ],
        },
        {
            id: "8",
            number: 8,
            title: "No Resale or Improper Distribution",
            paragraphs: [
                "Products purchased from Prisim Wellness may not be resold, repackaged, relabeled, redistributed, or transferred for any unlawful, improper, unsafe, or unauthorized purpose.",
                "Purchaser agrees not to market, advertise, distribute, or misrepresent any product purchased from Prisim Wellness in any unlawful, misleading, or unauthorized manner.",
            ],
        },
        {
            id: "9",
            number: 9,
            title: "Product Information and Website Content",
            paragraphs: [
                "Prisim Wellness strives to provide accurate and current information, but we do not warrant that website content, product descriptions, pricing, availability, images, labels, specifications, or other information is complete, accurate, current, error-free, or reliable.",
                "Product information may change without notice.",
                "Prisim Wellness reserves the right to correct errors, update information, change pricing, modify product availability, or cancel orders affected by errors or inaccuracies.",
            ],
        },
        {
            id: "10",
            number: 10,
            title: "No Warranty",
            paragraphs: [
                "All products, services, and website content are provided on an “as is” and “as available” basis.",
                "To the fullest extent permitted by law, Prisim Wellness disclaims all warranties, express or implied, including but not limited to:",
            ],
            list: [
                "Merchantability.",
                "Fitness for a particular purpose.",
                "Non-infringement.",
                "Accuracy or completeness of content.",
                "Product suitability for any particular use.",
                "Website availability, security, or error-free operation.",
            ],
            after: [
                "Prisim Wellness does not warrant that the website will be uninterrupted, secure, virus-free, or free from technical errors.",
            ],
        },
        {
            id: "13",
            number: 13,
            title: "Limitation of Liability",
            paragraphs: [
                "To the fullest extent permitted by law, Prisim Wellness, its owners, officers, directors, employees, contractors, suppliers, affiliates, and agents shall not be liable for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages arising from:",
            ],
            list: [
                "Use or misuse of products.",
                "Handling, storage, possession, or disposal of products.",
                "Reliance on website content.",
                "Website interruption or technical failure.",
                "Unauthorized access to customer information.",
                "Shipping delays, customs delays, lost shipments, or carrier issues.",
                "Any violation of these Terms by the purchaser.",
            ],
            after: [
                "In all cases, Prisim Wellness’s total liability shall be limited to the purchase price paid by the customer for the specific product giving rise to the claim.",
            ],
        },
        {
            id: "14",
            number: 14,
            title: "Indemnification",
            paragraphs: [
                "Purchaser agrees to indemnify, defend, and hold harmless Prisim Wellness, its owners, officers, directors, employees, contractors, suppliers, affiliates, and agents from and against any and all claims, losses, damages, liabilities, penalties, fines, costs, and expenses, including reasonable attorney fees, arising out of or related to:",
            ],
            list: [
                "Purchaser’s use, misuse, handling, storage, possession, distribution, or disposal of products.",
                "Purchaser’s violation of these Terms and Conditions.",
                "Purchaser’s violation of any law or regulation.",
                "Purchaser’s misrepresentation of qualifications, intended use, or legal eligibility.",
                "Any injury, damage, or loss caused by products after delivery to purchaser.",
            ],
        },
        {
            id: "15",
            number: 15,
            title: "Final Sale Policy",
            paragraphs: [
                "Due to the nature of the products, all sales are final.",
                "Prisim Wellness does not accept returns, exchanges, or cancellations after an order has been processed, except where required by applicable law or expressly approved by Prisim Wellness in writing.",
                "Please review your order carefully before completing your purchase.",
            ],
        },
        {
            id: "16",
            number: 16,
            title: "Shipping, Delivery, and Risk of Loss",
            paragraphs: [
                "Shipping times are estimates only and are not guaranteed.",
                "Prisim Wellness is not responsible for delays caused by shipping carriers, customs, weather, incorrect addresses, payment issues, regulatory holds, backorders, or circumstances beyond our reasonable control.",
                "Risk of loss may transfer to the purchaser once the order is delivered to the shipping carrier, unless otherwise required by applicable law.",
                "Customers are responsible for providing accurate shipping information. Prisim Wellness is not responsible for lost or delayed shipments caused by incorrect or incomplete addresses.",
            ],
        },
        {
            id: "17",
            number: 17,
            title: "Customs, Import, and International Orders",
            paragraphs: [
                "Customers placing international orders are solely responsible for understanding and complying with all laws, import rules, customs requirements, taxes, duties, and restrictions in their country.",
                "Prisim Wellness is not responsible for products delayed, seized, rejected, returned, destroyed, or confiscated by customs or regulatory authorities.",
                "No information on this website should be interpreted as confirmation that a product is legal to import, purchase, possess, or use in your jurisdiction.",
            ],
        },
        {
            id: "18",
            number: 18,
            title: "Payments",
            paragraphs: [
                "By placing an order, you authorize Prisim Wellness and its payment processors to charge your selected payment method for the total order amount, including applicable product costs, shipping fees, taxes, and other charges shown at checkout.",
                "Once payment is submitted and authorized, changes or corrections may not be possible.",
                "Prisim Wellness reserves the right to cancel or hold any order due to payment failure, suspected fraud, chargeback risk, incomplete verification, or compliance concerns.",
            ],
        },
        {
            id: "19",
            number: 19,
            title: "Chargebacks and Fraudulent Transactions",
            paragraphs: [
                "Customers agree not to initiate improper chargebacks after receiving products or after an order has been processed in accordance with these Terms.",
                "Prisim Wellness reserves the right to dispute chargebacks, provide transaction records to payment processors, suspend customer accounts, refuse future orders, and pursue any available legal remedies in cases of fraud, abuse, or improper payment disputes.",
            ],
        },
        {
            id: "20",
            number: 20,
            title: "Intellectual Property",
            paragraphs: [
                "All website content, including text, graphics, logos, product names, images, design elements, icons, branding, and layout, is the property of Prisim Wellness or its licensors and is protected by applicable intellectual property laws.",
                "You may not copy, reproduce, distribute, modify, display, sell, or exploit any website content without prior written permission from Prisim Wellness.",
            ],
        },
        {
            id: "21",
            number: 21,
            title: "Third-Party Links",
            paragraphs: [
                "This website may contain links to third-party websites, services, payment processors, shipping providers, or external resources.",
                "Prisim Wellness does not control and is not responsible for the content, policies, products, services, security, or practices of any third-party websites or services.",
                "Accessing third-party links is done at your own risk.",
            ],
        },
        {
            id: "22",
            number: 22,
            title: "User Information and Account Responsibility",
            paragraphs: [
                "You agree to provide accurate, current, and complete information when placing an order or using this website.",
                "You are responsible for maintaining the confidentiality of your account information and for all activity under your account.",
                "Prisim Wellness reserves the right to suspend or terminate accounts containing false, incomplete, misleading, fraudulent, or suspicious information.",
            ],
        },
        {
            id: "23",
            number: 23,
            title: "Termination",
            paragraphs: [
                "Prisim Wellness may suspend or terminate your access to the website, cancel orders, or refuse future transactions at any time, without prior notice, if we believe you have violated these Terms or engaged in conduct that presents legal, safety, fraud, or compliance concerns.",
                "You may stop using the website at any time.",
            ],
        },
        {
            id: "24",
            number: 24,
            title: "Force Majeure",
            paragraphs: [
                "Prisim Wellness shall not be liable for delay or failure to perform caused by events beyond its reasonable control, including but not limited to natural disasters, carrier delays, customs delays, labor disputes, supply shortages, backorders, power outages, cyber incidents, government actions, regulatory changes, war, terrorism, pandemic, or other emergencies.",
            ],
        },
        {
            id: "25",
            number: 25,
            title: "Governing Law and Jurisdiction",
            paragraphs: [
                "These Terms and Conditions shall be governed by and interpreted according to the laws of [Insert Governing State/Country], without regard to conflict of law principles.",
                "Any dispute arising out of or related to these Terms, the website, or any purchase from Prisim Wellness shall be resolved in the courts or arbitration venue located in [Insert Jurisdiction], unless otherwise required by applicable law.",
            ],
        },
        {
            id: "26",
            number: 26,
            title: "Severability",
            paragraphs: [
                "If any provision of these Terms and Conditions is found to be invalid, unlawful, or unenforceable, that provision shall be limited or removed to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.",
            ],
        },
        {
            id: "27",
            number: 27,
            title: "Entire Agreement",
            paragraphs: [
                "These Terms and Conditions, together with any policies referenced on this website, including the Privacy Policy, Shipping Policy, and Refund Policy, constitute the entire agreement between you and Prisim Wellness regarding your use of the website and purchase of products.",
            ],
        },
        {
            id: "28",
            number: 28,
            title: "Changes to These Terms",
            paragraphs: [
                "Prisim Wellness reserves the right to update, modify, or replace these Terms and Conditions at any time.",
                "Changes will be effective when posted on this website. Your continued use of the website or purchase of products after changes are posted means you accept the updated Terms.",
            ],
        },
        {
            id: "29",
            number: 29,
            title: "Contact Information",
            paragraphs: [
                "For questions regarding these Terms and Conditions, please contact:",
            ],
            contact: true,
        },
        {
            id: "checkout",
            number: "★",
            title: "Checkout Agreement Statement",
            paragraphs: [
                "By clicking “I Agree,” “Place Order,” “Complete Purchase,” or similar checkout confirmation, you confirm that:",
            ],
            list: [
                "You are at least 21 years old.",
                "You have read and agreed to these Terms and Conditions.",
                "You accept full responsibility for legal compliance, safe handling, and proper use of all products purchased.",
            ],
        },
    ];

    return (
        <PolicyLayout
            bannerHighlight="Terms"
            bannerTitle="& Conditions"
            overviewLabel="Agreement Overview"
            overviewParagraphs={[
                "These Terms and Conditions govern your access to and use of the Prism Wellness website, products, services, and any related content, communications, or transactions.",
                "If you do not agree with these Terms, you must not use this website or purchase products from Prism Wellness.",
            ]}
            sections={termsSections}
        />
    );
};

export default TermCondition;