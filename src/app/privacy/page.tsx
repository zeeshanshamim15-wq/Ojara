import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | OJARA",
  description:
    "How OJARA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="July 2026"
      intro="Your trust is sacred to us. This policy explains what information OJARA collects when you visit our store, how we use it, and the choices you have. By using this website you agree to the practices described below."
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "We collect information you provide directly — such as your name, email address, shipping address, and payment details — when you place an order, create an account, or subscribe to our newsletter.",
            "We also automatically collect certain technical data, including your IP address, browser type, device information, and the pages you view, through cookies and similar technologies.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "We use your information to process and fulfil your orders, communicate with you about your purchases, provide customer support, and send marketing communications where you have consented.",
            "We also use aggregated, non-identifying data to understand how our store is used and to improve your shopping experience.",
          ],
        },
        {
          heading: "Sharing Your Information",
          body: [
            "We never sell your personal information. We share it only with trusted service providers — payment processors, shipping carriers, and analytics partners — who help us operate our store, and only to the extent necessary to perform their services.",
            "We may disclose information where required by law or to protect the rights, property, or safety of OJARA and our customers.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "Cookies help us remember your cart, keep you signed in, and understand site performance. You can disable cookies in your browser settings, though some features of the store may not function as intended.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "Depending on where you live, you may have the right to access, correct, or delete the personal information we hold about you, and to object to or restrict certain processing. To exercise these rights, contact us at ojara.jewel@gmail.com.",
          ],
        },
        {
          heading: "Data Security & Retention",
          body: [
            "We use industry-standard safeguards to protect your information, and retain it only for as long as necessary to fulfil the purposes described in this policy or as required by law.",
          ],
        },
      ]}
    />
  );
}
