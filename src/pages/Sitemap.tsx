import { Link } from 'react-router-dom';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sitemap</h1>
            <p className="text-gray-600">Quick links to important pages on ProCounsel</p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/colleges" className="hover:text-blue-600">Colleges</Link></li>
            <li><Link to="/courses" className="hover:text-blue-600">Courses</Link></li>
            <li><Link to="/exams" className="hover:text-blue-600">Exams</Link></li>
            <li><Link to="/counselors" className="hover:text-blue-600">Counsellors</Link></li>
            <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600">Terms</Link></li>
            <li><Link to="/add-college" className="hover:text-blue-600">Add College</Link></li>
          </ul>

        </div>
      </div>
    </div>
  );
}
