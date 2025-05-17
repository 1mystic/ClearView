import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { MapPin, Edit3, BarChart2, UserCheck, AlertTriangle, Settings } from 'lucide-react';

const HowToUsePage = () => {
  const steps = [
    {
      icon: <UserCheck size={28} className="text-sky-400" />,
      title: "1. Register & Login",
      description: "Create an account or log in if you already have one. NGOs can register their organizations to get verified and access more features."
    },
    {
      icon: <Edit3 size={28} className="text-emerald-400" />,
      title: "2. Report Pollution",
      description: "Navigate to the 'Report Pollution' page. Fill in the details: location, type of pollution, description, and upload an image. Our AI will help classify the image."
    },
    {
      icon: <MapPin size={28} className="text-rose-400" />,
      title: "3. View the Map",
      description: "Explore the 'Map View' to see reported pollution incidents and biodiversity hotspots. Filter reports and click on markers for more details."
    },
    {
      icon: <BarChart2 size={28} className="text-amber-400" />,
      title: "4. Check Dashboards",
      description: "If you are a regular user, see your submitted reports in your User Dashboard. Admins and NGOs have dedicated dashboards to manage and verify reports."
    },
    {
      icon: <AlertTriangle size={28} className="text-red-500" />,
      title: "Understanding Report Statuses",
      description: "Reports can be 'Pending', 'Approved' (verified by admin or AI), 'Rejected', or 'Resolved'. Approved reports appear on the main map."
    },
    {
      icon: <Settings size={28} className="text-indigo-400" />,
      title: "Advanced: Image Classification",
      description: "When you upload an image for a report, our system uses TensorFlow MobileNet to classify it. If it detects pollution-related content (e.g., trash, smoke), it can auto-approve the report, speeding up the process."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-100 how-to-use-page-root">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-4xl modern-glass-page-card animate-fade-in-up">
          <div className="text-center p-6 md:p-10 border-b modern-card-header">
            <h1 className="page-main-title">How to Use Clear View</h1>
            <p className="page-subtitle mt-3">
              A simple guide to navigating and utilizing the Clear View platform for effective pollution management.
            </p>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <section>
              <h2 className="page-section-title">Getting Started</h2>
              <p className="page-text-content mt-3">
                Clear View is designed to be intuitive and user-friendly. Follow these steps to make the most of our platform and contribute to a cleaner environment:
              </p>
            </section>

            <section>
              <h2 className="page-section-title">Step-by-Step Guide</h2>
              <div className="space-y-6 mt-4">
                {steps.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="flex items-start space-x-4">
                      <div className="step-icon-wrapper">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="page-section-title">Tips for Effective Reporting</h2>
              <ul className="list-disc list-inside page-text-content mt-3 space-y-2 pl-1">
                <li><strong>Be Specific:</strong> Provide accurate location details. Use the map to pinpoint the exact spot.</li>
                <li><strong>Clear Photos:</strong> Upload clear, well-lit images of the pollution. This helps with AI classification and admin verification.</li>
                <li><strong>Detailed Descriptions:</strong> Describe the type and extent of pollution. The more information, the better.</li>
                <li><strong>Check Status:</strong> Monitor your submitted reports via your dashboard to see if they are approved or if more information is needed.</li>
              </ul>
            </section>
          </div>
          <div className="p-6 md:p-8 border-t modern-card-footer text-center">
            <p className="page-text-content">
              Need more help? Contact our support team through the details in the footer.
            </p>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <Footer />
      <style>{`
        .how-to-use-page-root { /* For scoping */ }

        /* General Page Animations (can be shared if in global CSS) */
        .animate-fade-in-up {
          animation: fadeInAnimation 0.7s ease-out forwards, slideUpAnimation 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpAnimation { from { transform: translateY(25px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* Page Card Styling (shared with About.jsx) */
        .modern-glass-page-card {
          background: rgba(28, 35, 49, 0.88);
          border-radius: 1.5rem;
          border: 1px solid rgba(107, 142, 35, 0.25);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.03) inset;
          backdrop-filter: blur(18px) saturate(1.8);
          color: #e0e7ff;
        }
        .modern-card-header {
          border-color: rgba(107, 142, 35, 0.2) !important;
        }
        .modern-card-footer {
          border-color: rgba(107, 142, 35, 0.15) !important;
          background-color: rgba(10, 18, 28, 0.3);
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
        }

        .page-main-title {
          font-size: 2.25rem; 
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(107,142,35,0.3);
        }
        .page-subtitle {
          font-size: 1.1rem; 
          color: #b0c4ef;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .page-section-title {
          font-size: 1.6rem;
          font-weight: 600;
          color: #e0e7ff;
          margin-bottom: 0.5rem;
          padding-bottom: 0.3rem;
          border-bottom: 2px solid rgba(107, 142, 35, 0.3);
          display: inline-block;
        }
        .page-text-content {
          font-size: 1rem;
          line-height: 1.75;
          color: #c0c8d4;
        }
        .page-text-content strong {
          color: #d0d8e4;
          font-weight: 600;
        }
        .page-text-content ul li::marker {
            color: rgba(107, 142, 35, 0.7);
        }

        /* Step Card Specific Styling */
        .step-card {
          background-color: rgba(20, 28, 40, 0.6);
          padding: 1.25rem 1.5rem; /* 20px 24px */
          border-radius: 0.75rem; /* 12px */
          border-left: 4px solid rgba(107, 142, 35, 0.5);
          transition: background-color 0.3s ease, border-left-color 0.3s ease;
        }
        .step-card:hover {
          background-color: rgba(25, 33, 45, 0.75);
          border-left-color: #82A83A;
        }
        .step-icon-wrapper {
          background-color: rgba(107, 142, 35, 0.1);
          border-radius: 0.5rem; /* 8px */
          padding: 0.5rem; /* 8px */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.1rem;
        }
        .step-title {
          font-size: 1.15rem; /* 18.4px */
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 0.25rem;
        }
        .step-description {
          font-size: 0.9rem; /* 14.4px */
          color: #a8b5c7;
          line-height: 1.6;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .page-main-title { font-size: 1.8rem; }
          .page-subtitle { font-size: 1rem; }
          .page-section-title { font-size: 1.35rem; }
          .modern-glass-page-card { padding: 1rem; border-radius: 1rem; }
          .step-card { padding: 1rem 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default HowToUsePage; 