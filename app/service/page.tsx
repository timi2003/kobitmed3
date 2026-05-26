"use client";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#0C1E46] mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 26, 2026</p>

        <div className="prose prose-slate max-w-none">
          <p>
            Welcome to KobitMed. These Terms of Service ("Terms") govern your access to and use of the KobitMed website, platform, and services (collectively, the "Service").
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Description of Service</h2>
          <p>
            KobitMed provides a remote patient monitoring platform using Internet of Medical Things (IoMT) technology. 
            The Service enables continuous monitoring of vital signs, real-time alerts, data visualization for clinicians, and secure storage of health information.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. User Eligibility</h2>
          <p>
            You must be at least 18 years old or have parental/guardian consent to use the Service. 
            Healthcare professionals using the platform must have the necessary licenses and qualifications.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. User Accounts and Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
            You agree to provide accurate and complete information when registering.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Health Data and Medical Disclaimer</h2>
          <p>
            The Service is designed to support remote patient monitoring but is <strong>not a substitute</strong> for professional medical advice, diagnosis, or treatment. 
            Always consult a qualified healthcare provider for medical decisions. KobitMed is not liable for any medical decisions made based on data from our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our <a href="/privacy" className="text-[#ED4137] hover:underline">Privacy Policy</a>, 
            which is incorporated into these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reverse engineer, decompile, or attempt to extract the source code of the Service.</li>
            <li>Transmit harmful code, viruses, or interfere with the Service.</li>
            <li>Use the Service for any unlawful purpose or to violate any applicable laws.</li>
            <li>Share your account credentials with unauthorized persons.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, KobitMed shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">9. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time, with or without cause, and without prior notice.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of [your city, e.g., Akure or Lagos].
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:<br />
            <strong>Email:</strong> legal@kobitmed.com
          </p>
        </div>
      </div>
    </div>
  );
}