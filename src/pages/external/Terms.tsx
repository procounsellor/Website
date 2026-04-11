export default function ExternalTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add top padding for header spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 lg:p-12">
          
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Terms &amp; Conditions
            </h1>
            <p className="text-lg text-gray-600">
              Last Updated: 20th August, 2025
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ProCounsel - A product of CATALYSTAI TECHNOLOGY PRIVATE LIMITED
            </p>
          </div>

          <div className="prose max-w-none">
            
            {/* Introduction */}
            <section className="mb-10">
              <p className="text-lg text-gray-700 mb-6">
                Welcome to <strong>ProCounsel</strong>! These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of our platform, 
                mobile application, and services (together, the &quot;App&quot;). This document covers terms for both 
                <strong> Students</strong> and <strong>Counsellors</strong> using our platform.
              </p>
              <p className="text-gray-700">
                By creating an account, booking an appointment, purchasing ProCoins, registering as a counsellor, 
                or otherwise using our services, you agree to these Terms. If you do not agree, you should not use our App.
              </p>
            </section>

            {/* STUDENT TERMS */}
            <section className="mb-12">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">TERMS FOR STUDENTS</h2>
                <p className="text-blue-700">The following terms apply to students using ProCounsel services</p>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Student Eligibility</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>You must be at least 18 years of age or use the App under parental/guardian supervision.</li>
                <li>You agree that all information you provide (such as name, email, and phone number) is accurate and up to date.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">2. Services We Provide</h3>
              <p className="text-gray-700 mb-4">
                <strong>ProCounsel acts as a bridge between students and education counsellors.</strong> As a student, you can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Explore</strong> colleges, courses, and exams available in India.</li>
                <li><strong>View counsellor profiles,</strong> including experience, availability, and office location.</li>
                <li><strong>Book appointments</strong> with counsellors.</li>
                <li><strong>Subscribe to counsellors</strong> for continued support during your admission process.</li>
                <li><strong>Communicate</strong> with subscribed counsellors through chat on the platform.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">3. ProCoins &amp; Payments</h3>
              
              <h4 className="text-xl font-semibold text-gray-700 mb-3">ProCoins System</h4>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>ProCoins</strong> are our in-app virtual currency (₹1 = 1 ProCoin).</li>
                <li>You can purchase ProCoins securely through our trusted payment gateway (Razorpay).</li>
                <li>Purchased ProCoins will be credited to your in-app wallet.</li>
                <li>ProCoins can be used to pay subscription fees set by counsellors.</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-700 mb-3">Payment Security</h4>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>ProCounsel does <strong>not store your sensitive payment information</strong> (e.g., card or UPI details).</li>
                <li>All transactions are processed securely via Razorpay.</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-700 mb-3">Refund Policy</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700">
                  <strong>Important:</strong> ProCoins once purchased are <strong>non-refundable</strong>.
                </p>
                <p className="text-gray-700 mt-2">
                  If, due to any error, excess money is added to your account than expected, please contact our support team immediately for resolution.
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">4. Student Responsibilities</h3>
              <p className="text-gray-700 mb-4">By using our App, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Use the App only for lawful purposes related to education and counselling.</li>
                <li>Provide accurate information when booking or subscribing.</li>
                <li>Not misuse, harass, or use offensive language while communicating with counsellors.</li>
                <li>Respect counsellors&apos; time and availability when booking sessions.</li>
                <li>Not attempt to bypass the App for direct payments or services.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">5. Counsellor Interaction</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700">
                  <strong>Important Notice:</strong> Counsellors listed on our App are <strong>independent professionals</strong>, 
                  not employees of ProCounsel.
                </p>
              </div>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>ProCounsel is <strong>not responsible</strong> for the accuracy of advice, guidance, or counselling provided.</li>
                <li>Students are encouraged to exercise their own judgment when making academic or career decisions.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">6. Cancellations &amp; Refunds</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Subscription cancellations are subject to the individual counsellor&apos;s terms, but once ProCoins are spent, they cannot be reversed.</li>
              </ul>
            </section>

            {/* COUNSELLOR TERMS */}
            <section className="mb-12">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
                <h2 className="text-3xl font-bold text-purple-800 mb-2">TERMS FOR COUNSELLORS</h2>
                <p className="text-purple-700">The following terms apply to counsellors providing services on ProCounsel</p>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Purpose of ProCounsel</h3>
              <p className="text-gray-700 mb-6">
                ProCounsel is an online platform that connects students with verified education counsellors for academic guidance, 
                career counselling, and admission-related consultations. Counsellors provide services based on student subscriptions 
                (Plus, Pro, Elite) ensuring quality, professionalism, and compliance with these Terms.
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">2. Account Verification &amp; Activation</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Your account will be activated only after verification and approval by the ProCounsel team.</li>
                <li>Counselling charges, revenue share, and applicable commission will be finalized during or after verification.</li>
                <li>You may not provide services or earn rewards until your account is officially activated.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">3. Earnings, Payments &amp; ProCoins</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Counsellors earn rewards in the form of ProCoins for services rendered.</li>
                <li><strong>1 ProCoin = INR 1</strong> (Indian Rupee).</li>
                <li>You may request a withdrawal of ProCoins into INR via the platform dashboard.</li>
                <li>Withdrawals will be processed within <strong>7–15 working days</strong>, subject to applicable deductions (TDS, GST, commissions).</li>
                <li>Payments will be transferred to your designated bank account.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">4. Independent Contractor Relationship</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>You act as an <strong>independent service provider</strong>, not an employee, partner, or agent of ProCounsel.</li>
                <li>You are free to offer services elsewhere, provided you do not solicit or promote competing services to ProCounsel students outside the platform.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">5. Tax Responsibility</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>You are solely responsible for all taxes (including TDS, GST, or income tax) arising from earnings received through the platform.</li>
                <li>You agree to comply with applicable Indian tax laws, including filing returns and paying liabilities.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">6. Counsellor Code of Conduct</h3>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Maintain professionalism, honesty, and integrity in all interactions.</li>
                <li>Respect student confidentiality and privacy.</li>
                <li>Avoid making false claims, guarantees of admissions, or unrealistic promises.</li>
                <li>Not engage in offensive, discriminatory, or unprofessional conduct.</li>
                <li>Not solicit direct contact or off-platform payments from students.</li>
                <li>Comply with applicable laws and ProCounsel&apos;s policies.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">7. Intellectual Property &amp; Confidentiality</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>All proprietary technology, branding, and content provided by ProCounsel remain the Company&apos;s property.</li>
                <li>Any counselling material you create remains your property, but ProCounsel may use it for quality audits, dispute resolution, or training.</li>
                <li>You must keep confidential all sensitive information about students, the platform, and Company operations.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">8. Liability &amp; Indemnity</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>You warrant that you have the necessary qualifications and expertise to provide counselling services.</li>
                <li>The Company is not liable for any consequences of your guidance.</li>
                <li>You agree to indemnify and hold the Company harmless from any claims, damages, or liabilities arising from your services.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">9. Counsellor Termination</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>ProCounsel may terminate your account immediately for breach of these Terms, unethical conduct, poor performance, or non-compliance with laws.</li>
                <li>Either party may terminate with <strong>7 days&apos; written notice</strong>.</li>
                <li>Outstanding ProCoins will be settled as per withdrawal terms.</li>
                <li>Upon termination, you must stop representing any association with ProCounsel.</li>
              </ul>
            </section>

            {/* GENERAL TERMS */}
            <section className="mb-12">
              <div className="bg-gray-50 border-l-4 border-gray-500 p-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">GENERAL TERMS</h2>
                <p className="text-gray-700">The following terms apply to all users of ProCounsel</p>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Privacy</h3>
              <p className="text-gray-700 mb-6">We collect and use your personal information in accordance with our <strong>Privacy Policy</strong>. By using the App, you consent to such collection and usage.</p>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">2. Limitations of Liability</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>ProCounsel provides the platform but does not guarantee the accuracy, success, or outcome of counselling sessions.</li>
                <li>We are not liable for any decisions you make based on counsellor advice.</li>
                <li>To the fullest extent permitted by law, ProCounsel disclaims liability for indirect, incidental, or consequential damages.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">3. Termination</h3>
              <p className="text-gray-700 mb-4">We may suspend or terminate your account if you:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Misuse the App</li>
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or abusive activity</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">4. Changes to Terms</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>ProCounsel may update these Terms from time to time.</li>
                <li>We will notify you of significant changes through the App or via email.</li>
                <li>Continued use of the App after changes means you accept the updated Terms.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">5. Dispute Resolution</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Parties shall first attempt to resolve disputes amicably through discussion.</li>
                <li>If unresolved, disputes will fall under the jurisdiction of courts in Pune, Maharashtra, India.</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">6. Governing Law</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>These Terms shall be governed by and construed under the laws of <strong>India</strong>.</li>
                <li>Any disputes shall be subject to the exclusive jurisdiction of courts in <strong>Pune, Maharashtra, India</strong>.</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <p className="text-gray-700 mb-4">If you have any questions about these Terms, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> hr@procounsel.co.in</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> 7004789484, 9470988669</p>
                <p className="text-gray-700 mb-2"><strong>Company:</strong> CATALYSTAI TECHNOLOGY PRIVATE LIMITED</p>
                <p className="text-gray-700"><strong>Address:</strong> Office No. 327, 3rd Floor, Geras Imperium Rise, MIDC Phase 2 Main Road, Near Gears Imperium Rise Plaza, Hinjawadi, Pune, Maharashtra - 411057</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✅ <strong>Complete Coverage:</strong> This document covers all terms for both students and counsellors, 
                  including rights, responsibilities, ProCoins usage, payments, cancellations, counsellor interaction, 
                  liability, and governing law.
                </p>
              </div>
              <p className="text-sm text-gray-600 italic mt-4">These Terms &amp; Conditions are effective as of 20th August, 2025, and apply to all users of the ProCounsel platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
