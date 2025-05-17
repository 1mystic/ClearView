import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { Lightbulb, Target, Users, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Target size={28} className="text-emerald-400" />,
      title: "Pollution Reporting",
      description: "Easily report pollution incidents with detailed information and image uploads. Your reports help us identify and address environmental issues."
    },
    {
      icon: <Lightbulb size={28} className="text-sky-400" />,
      title: "AI-Powered Validation",
      description: "Leveraging TensorFlow MobileNet, our platform automatically classifies images to validate reports, ensuring accuracy and speeding up the approval process."
    },
    {
      icon: <Users size={28} className="text-fuchsia-400" />,
      title: "Community & NGO Collaboration",
      description: "Connect with other users and NGOs to tackle environmental challenges together. Share insights, coordinate efforts, and make a collective impact."
    },
    {
      icon: <ShieldCheck size={28} className="text-amber-400" />,
      title: "Biodiversity Protection",
      description: "Identify and monitor biodiversity hotspots. Our map highlights these critical areas, helping to protect and conserve local ecosystems."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-100 about-page-root">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-4xl modern-glass-page-card animate-fade-in-up">
          <div className="text-center p-6 md:p-10 border-b modern-card-header">
            <h1 className="page-main-title">About Clear View</h1>
            <p className="page-subtitle mt-3">
              Empowering communities to monitor, report, and combat pollution for a healthier planet.
            </p>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <section>
              <h2 className="page-section-title">Our Mission</h2>
              <p className="page-text-content mt-3">
                Clear View is dedicated to providing a transparent and accessible platform for individuals, communities, and organizations to actively participate in environmental stewardship. We believe that by harnessing the power of technology and collective action, we can create a significant positive impact on our environment, making our world cleaner and greener for generations to come.
              </p>
            </section>

            <section>
              <h2 className="page-section-title">What We Do</h2>
              <p className="page-text-content mt-3">
                Our application enables users to report various types of pollution, from litter and waste dumping to air and water contamination. These reports are then visualized on an interactive map, providing a clear overview of environmental issues in different areas. Key features include:
              </p>
            </section>

            <section>
              <h2 className="page-section-title">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="feature-icon-wrapper">
                        {feature.icon}
                      </div>
                      <h3 className="feature-title">{feature.title}</h3>
                    </div>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="page-section-title">Our Vision</h2>
              <p className="page-text-content mt-3">
                We envision a future where technology and community collaboration lead to a significant reduction in pollution and enhanced protection of our natural ecosystems. Clear View aims to be a catalyst for this change, fostering a global community committed to environmental health.
              </p>
            </section>
          </div>
           <div className="p-6 md:p-8 border-t modern-card-footer text-center">
                <p className="page-text-content">
                    Join us in making a difference. Your participation is key to our success!
                </p>
            </div>
        </div>
      </main>

      <MobileBottomNav />
      <Footer />
      <style>{`
        .about-page-root { /* For scoping */ }

        /* General Page Animations */
        .animate-fade-in-up { 
          animation: fadeInAnimation 0.7s ease-out forwards, slideUpAnimation 0.6s ease-out forwards;
          opacity: 0; /* Start hidden for animation */
        }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpAnimation { from { transform: translateY(25px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* Page Card Styling */
        .modern-glass-page-card {
          background: rgba(28, 35, 49, 0.88); 
          border-radius: 1.5rem; /* 24px */
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
          font-size: 2.25rem; /* 36px */
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(107,142,35,0.3);
        }
        .page-subtitle {
          font-size: 1.1rem; /* 17.6px */
          color: #b0c4ef; 
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .page-section-title {
          font-size: 1.6rem; /* 25.6px */
          font-weight: 600;
          color: #e0e7ff;
          margin-bottom: 0.5rem;
          padding-bottom: 0.3rem;
          border-bottom: 2px solid rgba(107, 142, 35, 0.3);
          display: inline-block;
        }
        .page-text-content {
          font-size: 1rem; /* 16px */
          line-height: 1.75;
          color: #c0c8d4;
        }
        .page-text-content strong {
          color: #d0d8e4;
          font-weight: 600;
        }
        .page-text-content a {
          color: #82A83A;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease, text-shadow 0.2s ease;
        }
        .page-text-content a:hover {
          color: #98c055;
          text-decoration: underline;
          text-shadow: 0 0 8px rgba(152, 192, 85, 0.5);
        }
        
        /* Feature Card Specific Styling */
        .feature-card {
          background-color: rgba(20, 28, 40, 0.7);
          padding: 1.5rem; /* 24px */
          border-radius: 1rem; /* 16px */
          border: 1px solid rgba(107, 142, 35, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3), 0 0 0 1px rgba(107, 142, 35, 0.3);
        }
        .feature-icon-wrapper {
          background-color: rgba(107, 142, 35, 0.15);
          border-radius: 50%;
          padding: 0.6rem; /* 10px */
          display: inline-flex;
          border: 1px solid rgba(107, 142, 35, 0.25);
        }
        .feature-title {
          font-size: 1.2rem; /* 19.2px */
          font-weight: 600;
          color: #e5e7eb;
        }
        .feature-description {
          font-size: 0.9rem; /* 14.4px */
          color: #a8b5c7;
          line-height: 1.6;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .page-main-title { font-size: 1.8rem; } /* 28.8px */
          .page-subtitle { font-size: 1rem; } /* 16px */
          .page-section-title { font-size: 1.35rem; } /* 21.6px */
          .modern-glass-page-card { padding: 1rem; border-radius: 1rem; }
          .feature-card { padding: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage; 