import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Last Updated: 20th August, 2025</p>
            <p className="text-sm text-gray-500 mt-2">
              ProCounsel - A product of CATALYSTAI TECHNOLOGY PRIVATE LIMITED
            </p>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-8">
              This Privacy Policy explains how <strong>CATALYSTAI TECHNOLOGY PRIVATE LIMITED</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) 
              collects, uses, and protects your personal information when you use the ProCounsel platform, mobile application, 
              and related services (collectively, the &quot;App&quot;).
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Educational background and academic interests</li>
                <li>Profile information and preferences</li>
                <li>Communication data and chat messages within the platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Usage Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>App usage patterns and interaction data</li>
                <li>Device information (type, operating system, unique identifiers)</li>
                <li>Log information (IP address, access times, pages viewed)</li>
                <li>Location data (with your permission)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">For Students</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Provide personalized college and course recommendations</li>
                <li>Facilitate connections with suitable education counsellors</li>
                <li>Process appointments and subscription services</li>
                <li>Enable secure communication through our chat platform</li>
                <li>Send relevant educational content and updates</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">For Counsellors</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Create and manage professional profiles</li>
                <li>Match with relevant students seeking guidance</li>
                <li>Process payments and manage subscription services</li>
                <li>Provide platform analytics and performance insights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li><strong>With Counsellors:</strong> Basic profile information when you book appointments or subscribe to their services</li>
                <li><strong>Service Providers:</strong> Trusted third-party services that help us operate the platform (payment processing, hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                <li><strong>Safety and Security:</strong> To protect the rights, property, or safety of our users and the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>Encrypted data transmission using SSL/TLS protocols</li>
                <li>Secure payment processing through Razorpay (we do not store payment card details)</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure cloud infrastructure with data backup and recovery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Your Rights and Choices</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li><strong>Access:</strong> Request access to your personal information we hold</li>
                <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                <li><strong>Communication Preferences:</strong> Opt-out of promotional communications</li>
                <li><strong>Account Deactivation:</strong> Deactivate your account at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our services</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are primarily intended for users 18 years and older. Users under 18 should use our platform 
                under parental or guardian supervision. We do not knowingly collect personal information from children 
                under 13 without appropriate consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with 
                legal obligations. When you delete your account, we will remove your personal information within 
                30 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure 
                appropriate safeguards are in place to protect your personal information in accordance with this 
                Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                through the App or via email. Your continued use of our services after such changes constitutes 
                acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> hr@procounsel.co.in</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> 7004789484, 9470988669</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> CATALYSTAI TECHNOLOGY PRIVATE LIMITED, Office No. 327, 3rd Floor, Geras Imperium Rise, MIDC Phase 2 Main Road, Near Gears Imperium Rise Plaza, Hinjawadi, Pune, Maharashtra - 411057</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600 italic">
                This Privacy Policy is effective as of 20th August, 2025, and applies to all users of the ProCounsel platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}