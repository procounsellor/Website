import { Link } from 'react-router-dom';
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              About ProCounsel
            </h1>
            <p className="text-lg text-gray-600">
              Bridging the gap between ambitious students and expert education counsellors
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Updated: 20th August, 2025
            </p>
          </div>

          <div className="prose max-w-none">
            
            {/* Our Mission */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                ProCounsel acts as a comprehensive bridge between students and education counsellors, 
                empowering students to make informed decisions about their academic and career journey. 
                We believe every student deserves access to expert guidance when navigating the complex 
                landscape of higher education in India.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform democratizes access to quality education counselling, making it easier 
                for students to connect with verified professionals who can guide them through college 
                admissions, course selections, and career planning.
              </p>
            </section>

            {/* What We Do */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Do</h2>
              
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">For Students</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Explore comprehensive information about colleges, courses, and exams available across India</li>
                <li>Browse detailed counsellor profiles with experience, specializations, and availability</li>
                <li>Book personalized appointment sessions with expert counsellors</li>
                <li>Subscribe to counsellors for ongoing support throughout your admission process</li>
                <li>Communicate directly with subscribed counsellors through our secure chat platform</li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-600 mb-4">For Counsellors</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Create comprehensive profiles showcasing expertise and experience</li>
                <li>Manage availability and appointment scheduling efficiently</li>
                <li>Connect with motivated students seeking guidance</li>
                <li>Offer subscription-based ongoing support services</li>
                <li>Build lasting relationships with students throughout their academic journey</li>
              </ul>
            </section>

            {/* Platform Features */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Platform Features</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-3 text-gray-800">💰 ProCoins System</h4>
                  <p className="text-gray-600">
                    Secure virtual currency (₹1 = 1 ProCoin) for seamless transactions, 
                    powered by Razorpay for safe and reliable payments.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-3 text-gray-800">🔒 Secure Platform</h4>
                  <p className="text-gray-600">
                    Your privacy and data security are our top priorities. We maintain strict 
                    confidentiality and secure communication channels.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-3 text-gray-800">📚 Comprehensive Database</h4>
                  <p className="text-gray-600">
                    Access detailed information about colleges, courses, exams, and admission 
                    processes across India in one centralized platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Company Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Company Information</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Legal Entity</h4>
                  <p className="text-gray-700 mb-6">
                      ProCounsel is owned and operated by <strong>CATALYSTAI TECHNOLOGY PRIVATE LIMITED</strong>, 
                    a company committed to leveraging technology for educational advancement.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Jurisdiction</h4>
                  <p className="text-gray-700">
                    We operate under Indian law with exclusive jurisdiction in Pune, Maharashtra, 
                    ensuring compliance with all applicable regulations and standards.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h4>
                  <p className="text-gray-700 mb-6">
                    To become India&apos;s most trusted platform for education counselling, where every 
                    student can access personalized guidance to unlock their full potential.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h4>
                  <p className="text-gray-700">
                    <strong>Email:</strong> hr@procounsel.co.in<br />
                    <strong>Phone:</strong> 7004789484, 9470988669<br />
                    <strong>Location:</strong> CATALYSTAI TECHNOLOGY PRIVATE LIMITED, Office No. 327, 3rd Floor, Geras Imperium Rise, MIDC Phase 2 Main Road, Near Gears Imperium Rise Plaza, Hinjawadi, Pune, Maharashtra - 411057
                  </p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="text-center bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h3>
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of students who have found their path with ProCounsel
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 inline-block">
                  Explore Colleges
                </Link>
                <Link to="/courses" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 inline-block">
                  Find Courses
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600 italic text-center">
                This information was last updated on 20th August, 2025, and reflects our current services and commitments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}