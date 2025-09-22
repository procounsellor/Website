import { Link } from 'react-router-dom';

export default function AddCollegePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add top padding for header spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🏫</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Add a College</h1>
            <p className="text-lg text-gray-600">Help us expand our database by suggesting colleges for other students</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-blue-500 text-xl">💡</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">How it works</h3>
                <p className="text-blue-700 mt-1">
                  Currently, this feature is being developed. In the meantime, you can suggest colleges by emailing us directly with the college details.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">What to include in your email:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  College name and location
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  Courses offered
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  Admission requirements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  Official website (if available)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  Any other relevant information
                </li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Please email us with college details and we will review and add them to our database:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:hr@procounsel.co.in?subject=College Addition Request"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <span>📧</span>
                  Email College Details
                </a>
                
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <span>📞</span>
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="pt-8 border-t border-gray-200 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
              >
                <span>←</span>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
