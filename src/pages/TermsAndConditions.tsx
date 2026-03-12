import { ScrollText } from "lucide-react";
import usePageSEO from "@/hooks/usePageSEO";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using StayVida (the 'Platform'), you agree to be bound by these Terms and Conditions ('Terms').",
      "If you do not agree with any part of these Terms, please discontinue use of the Platform immediately.",
      "These Terms apply to all visitors, users, registered members, and anyone who transacts through StayVida.",
      "We reserve the right to update these Terms at any time. Continued use of the Platform after changes constitutes acceptance.",
    ],
  },
  {
    title: "2. User Accounts",
    content: [
      "You must be at least 18 years of age to create an account and make bookings on StayVida.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate, current, and complete information during registration.",
      "StayVida reserves the right to suspend or terminate accounts that violate these Terms.",
    ],
  },
  {
    title: "3. Bookings and Reservations",
    content: [
      "All bookings made through StayVida are subject to availability and confirmation by the respective property or event venue.",
      "A booking is only confirmed once you receive a confirmation email from StayVida.",
      "StayVida acts as an intermediary between users and service providers; we are not responsible for the quality or accuracy of third-party listings.",
      "You agree to the specific policies (check-in, check-out, house rules) of the property you book.",
    ],
  },
  {
    title: "4. Payments",
    content: [
      "All prices displayed on the Platform are inclusive of applicable taxes unless stated otherwise.",
      "Payments are processed securely through our payment partners. StayVida does not store full payment card details.",
      "In case of payment failure, your booking will not be confirmed. Please retry or contact support.",
      "Currency conversion rates are determined by your bank or payment provider; StayVida is not liable for any differences.",
    ],
  },
  {
    title: "5. Cancellations and Refunds",
    content: [
      "Cancellation policies vary by property and event. Please review the specific policy before confirming your booking.",
      "Refunds, where applicable, will be processed within 7–14 business days to the original payment method.",
      "StayVida's convenience fee, if charged, is non-refundable unless the cancellation is due to our error.",
      "In case of a dispute regarding a refund, please contact our support team at info@stayvida.com.",
    ],
  },
  {
    title: "6. User Conduct",
    content: [
      "You agree not to use the Platform for any unlawful, harmful, or fraudulent purpose.",
      "You must not post false, misleading, or defamatory reviews or content.",
      "Scraping, crawling, or automated data extraction from the Platform is strictly prohibited.",
      "You must not attempt to gain unauthorised access to any part of the Platform or its related systems.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "All content on StayVida, including text, graphics, logos, and software, is the exclusive property of StayVida or its licensors.",
      "You are granted a limited, non-exclusive, non-transferable licence to use the Platform for personal, non-commercial purposes.",
      "Reproduction, distribution, or modification of any Platform content without prior written consent is prohibited.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "StayVida shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.",
      "Our total liability for any claim related to your use of the Platform shall not exceed the amount paid for the booking in dispute.",
      "We are not responsible for service failures, property conditions, or events caused by third-party providers.",
    ],
  },
  {
    title: "9. Disclaimer of Warranties",
    content: [
      "The Platform is provided on an 'as is' and 'as available' basis without warranties of any kind.",
      "StayVida does not warrant that the Platform will be error-free, uninterrupted, or free of viruses.",
      "Property descriptions, images, and ratings are provided by partners and may not always reflect current conditions.",
    ],
  },
  {
    title: "10. Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of India.",
      "Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "For any questions regarding these Terms and Conditions, please reach out to us at info@stayvida.com or call +91 094057 58183.",
    ],
  },
];

function TermsAndConditions() {
  usePageSEO({
    title: "Terms & Conditions",
    description: "Review StayVida's Terms and Conditions governing your use of our hotel and event booking platform.",
    keywords: "terms and conditions, StayVida terms, booking terms",
  });
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="relative bg-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[40rem] h-[40rem] border border-white rounded-full -top-64 -left-64" />
          <div className="absolute w-[50rem] h-[50rem] border border-white rounded-full -bottom-64 -right-64" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-700 rounded-2xl mb-6 shadow-lg">
            <ScrollText className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using StayVida. They govern
            your access to and use of our platform and services.
          </p>
          <p className="text-green-400 text-sm mt-4">
            Last updated: March 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <p className="text-neutral-600 text-lg leading-relaxed mb-10 border-l-4 border-green-500 pl-6">
              Welcome to <strong>StayVida</strong>. These Terms and Conditions
              outline the rules and regulations for the use of our platform. By
              accessing this website, we assume you accept these terms in full.
              Do not continue to use StayVida if you do not accept all of the
              terms stated on this page.
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 bg-green-500 rounded-full" />
                    {section.title}
                  </h2>
                  <ul className="space-y-2 pl-4">
                    {section.content.map((point, i) => (
                      <li key={i} className="flex gap-3 text-neutral-600 leading-relaxed">
                        <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsAndConditions;
