import { Shield } from "lucide-react";
import usePageSEO from "@/hooks/usePageSEO";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Personal identification information (name, email address, phone number) when you register or make a booking.",
      "Payment details processed securely through our payment partners — we do not store full card information.",
      "Usage data such as pages visited, search queries, timestamps, IP address, and browser type.",
      "Location data (if permitted) to suggest nearby hotels and venues.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To process reservations, bookings, and payments seamlessly.",
      "To send booking confirmations, receipts, and service-related notifications.",
      "To personalise your experience and surface relevant recommendations.",
      "To improve our platform, fix bugs, and develop new features.",
      "To comply with legal obligations and prevent fraudulent activity.",
    ],
  },
  {
    title: "3. Sharing Your Information",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We share data with hotel and venue partners only to the extent necessary to fulfil your booking.",
      "We may share information with service providers (payment processors, email delivery, analytics) under strict confidentiality agreements.",
      "We may disclose information when required by law or to protect the rights and safety of StayVida and its users.",
    ],
  },
  {
    title: "4. Cookies",
    content: [
      "We use cookies and similar tracking technologies to enhance your browsing experience.",
      "Essential cookies are required for the website to function correctly.",
      "Analytics cookies help us understand how visitors interact with our platform.",
      "You can disable non-essential cookies through your browser settings at any time.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We implement industry-standard SSL/TLS encryption to protect data in transit.",
      "Access to personal data is restricted to authorised personnel only.",
      "We conduct regular security audits and vulnerability assessments.",
      "Despite our safeguards, no method of internet transmission is 100% secure; we cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your personal data for as long as your account is active or as necessary to provide services.",
      "Booking records may be kept for up to 7 years to comply with financial and legal obligations.",
      "You may request deletion of your account and associated data at any time (subject to legal retention requirements).",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "Access: You may request a copy of the personal data we hold about you.",
      "Correction: You may request correction of inaccurate or incomplete data.",
      "Deletion: You may request deletion of your data where no legal obligation requires its retention.",
      "Portability: You may request your data in a structured, machine-readable format.",
      "Objection: You may object to certain processing activities, including direct marketing.",
    ],
  },
  {
    title: "8. Third-Party Links",
    content: [
      "Our platform may contain links to third-party websites. We are not responsible for their privacy practices.",
      "We encourage you to review the privacy policies of any third-party sites you visit.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.",
      "We will notify you of significant changes via email or a prominent notice on our website.",
      "Your continued use of StayVida after any changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      "If you have questions or concerns about this Privacy Policy, please contact us at info@stayvida.com or call +91 094057 58183.",
    ],
  },
];

function PrivacyPolicy() {
  usePageSEO({
    title: "Privacy Policy",
    description: "Read StayVida's Privacy Policy to understand how we collect, use, and protect your personal data.",
    keywords: "privacy policy, data protection, StayVida privacy",
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
            <Shield className="w-8 h-8 text-green-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Learn how StayVida collects, uses, and
            protects your personal information.
          </p>
          <p className="text-green-400 text-sm mt-4">
            Last updated: March 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <p className="text-neutral-600 text-lg leading-relaxed mb-10 border-l-4 border-green-500 pl-6">
              At <strong>StayVida</strong>, we are committed to protecting your
              personal information and your right to privacy. This Privacy Policy
              explains what data we collect, why we collect it, and how we use
              it. By using our platform, you agree to the terms described here.
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

export default PrivacyPolicy;
