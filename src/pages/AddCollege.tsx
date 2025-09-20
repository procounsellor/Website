import { Link } from 'react-router-dom';

export default function AddCollegePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add a College</h1>
            <p className="text-gray-600">If you'd like to suggest a college to be added to our database, please share basic details here.</p>
          </div>

          <div className="prose">
            <p className="text-gray-700">Currently this feature is a placeholder. Please email <a href="mailto:hr@procounsel.co.in" className="underline">hr@procounsel.co.in</a> with college details and we will review.</p>
            <div className="mt-6 text-center">
              <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
