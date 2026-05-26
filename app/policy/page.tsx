"use client";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#0C1E46] mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 26, 2026</p>

        <div className="prose prose-slate max-w-none">
          <p>
            KobitMed ("we", "us", or "our") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website <strong>kobitmed.com</strong>, use our services, or interact with our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide.</li>
            <li><strong>Health-Related Data:</strong> Vital signs, physiological data (e.g., heart rate, SpO₂), and other medical information transmitted through our IoMT devices and platform.</li>
            <li><strong>Usage Data:</strong> IP address, browser type, device information, and interaction with our services.</li>
            <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance user experience and analyze usage.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our remote patient monitoring services.</li>
            <li>Process and analyze health data for real-time monitoring and alerts.</li>
            <li>Communicate with you regarding your account, updates, and support.</li>
            <li>Ensure compliance with legal and regulatory requirements, including the Nigerian Data Protection Act (NDPA) 2023.</li>
            <li>Improve platform security and prevent fraud.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal or health data. We may share information only in the following cases:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your explicit consent.</li>
            <li>With healthcare providers or authorized clinicians as part of the service.</li>
            <li>With trusted service providers who assist in operating our platform (under strict confidentiality agreements).</li>
            <li>When required by law or to protect the rights, property, or safety of KobitMed, our users, or the public.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Data Security</h2>
          <p>We implement industry-standard security measures including AES-256 encryption, TLS, and access controls to protect your data. However, no system is completely secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, correct, or delete your personal information.</li>
            <li>Withdraw consent for processing your data (subject to legal limitations).</li>
            <li>Request data portability.</li>
            <li>Opt-out of certain data collection practices.</li>
          </ul>
          <p>To exercise these rights, please contact us at support@kobitmed.com.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Data Retention</h2>
          <p>We retain your data only as long as necessary to provide our services or as required by law. Health data is subject to strict storage limitation rules under NDPA 2023.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
            <strong>Email:</strong> privacy@kobitmed.com<br />
            <strong>Address:</strong> [Your Company Address, Akure or Lagos, Nigeria]
          </p>
        </div>
      </div>
    </div>
  );
}