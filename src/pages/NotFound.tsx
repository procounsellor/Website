import { useNavigate } from 'react-router-dom';
import PageSEO from '@/components/SEO/PageSEO';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <PageSEO
        title="Page Not Found – ProCounsel"
        description="The page you're looking for doesn't exist. Return to ProCounsel home."
        canonical="/404"
      />
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#2F43F2] mb-4">404</h1>
            <h2 className="text-4xl font-bold text-[#0E1629] mb-3">Page Not Found</h2>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-[#0E1629] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Go to Home
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full border border-[#0E1629] text-[#0E1629] font-semibold py-3 px-6 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
