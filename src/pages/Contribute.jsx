import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { Recycle, Leaf, Lightbulb, Zap, Bike, Link as LinkIcon, Users, HeartHandshake } from 'lucide-react';

const ContributePage = () => {
  const tips = {
    reduceCarbonFootprint: [
      {
        icon: <Recycle size={24} className="text-blue-400" />,
        title: "Reduce, Reuse, Recycle",
        description: "Minimize waste by choosing reusable products, repairing items, and recycling materials like paper, plastic, and glass."
      },
      {
        icon: <Zap size={24} className="text-yellow-400" />,
        title: "Conserve Energy",
        description: "Use energy-efficient appliances, switch to LED lighting, and unplug electronics when not in use. Consider renewable energy sources if possible."
      },
      {
        icon: <Bike size={24} className="text-green-400" />,
        title: "Sustainable Transportation",
        description: "Walk, cycle, or use public transport. If driving is necessary, consider carpooling or an electric/hybrid vehicle."
      },
      {
        icon: <Leaf size={24} className="text-lime-400" />,
        title: "Eat Mindfully",
        description: "Reduce meat consumption, choose local and seasonal produce, and minimize food waste. Plant-based diets generally have a lower carbon footprint."
      }
    ],
    cleanerGreenerEnvironment: [
      {
        icon: <Leaf size={24} className="text-green-500" />,
        title: "Plant Trees & Native Plants",
        description: "Trees absorb CO2 and provide habitats. Native plants support local ecosystems and require less water and maintenance."
      },
      {
        icon: <Users size={24} className="text-teal-400" />,
        title: "Participate in Cleanups",
        description: "Join or organize local cleanups in your community for parks, beaches, or rivers. Every little bit helps."
      },
      {
        icon: <Lightbulb size={24} className="text-orange-400" />,
        title: "Educate & Advocate",
        description: "Share your knowledge about environmental issues with others and advocate for policies that protect the environment."
      },
      {
        icon: <HeartHandshake size={24} className="text-rose-400" />,
        title: "Support Eco-Friendly Initiatives",
        description: "Support businesses and organizations that prioritize sustainability and environmentally friendly practices."
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-100 contribute-page-root">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-4xl modern-glass-page-card animate-fade-in-up">
          <div className="text-center p-6 md:p-10 border-b modern-card-header">
            <h1 className="page-main-title">Contribute to a Cleaner Planet</h1>
            <p className="page-subtitle mt-3">
              Your actions matter. Discover how you can contribute to reducing pollution and fostering a healthier environment for all.
            </p>
          </div>

          <div className="p-6 md:p-10 space-y-10">
            <section>
              <h2 className="page-section-title mb-1"><Recycle className="inline-block mr-2 text-blue-400 -mt-1" />Reducing Your Carbon Footprint</h2>
              <p className="page-text-content mt-3 mb-6">Small changes in your daily life can significantly reduce your carbon emissions and help combat climate change. Here are some impactful ways to start:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tips.reduceCarbonFootprint.map((tip, index) => (
                  <div key={index} className="tip-card">
                    <div className="flex items-center space-x-3 mb-2.5">
                      <div className="tip-icon-wrapper bg-blue-500/10 border-blue-500/30">
                        {tip.icon}
                      </div>
                      <h3 className="tip-title">{tip.title}</h3>
                    </div>
                    <p className="tip-description">{tip.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="page-section-title mb-1"><Leaf className="inline-block mr-2 text-green-400 -mt-1" />Creating a Cleaner, Greener Environment</h2>
              <p className="page-text-content mt-3 mb-6">Beyond reducing your personal footprint, you can actively contribute to making your local and global environment cleaner and more sustainable:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tips.cleanerGreenerEnvironment.map((tip, index) => (
                  <div key={index} className="tip-card">
                    <div className="flex items-center space-x-3 mb-2.5">
                      <div className={`tip-icon-wrapper ${tip.icon.props.className.includes('green') || tip.icon.props.className.includes('lime') ? 'bg-green-500/10 border-green-500/30' : tip.icon.props.className.includes('teal') ? 'bg-teal-500/10 border-teal-500/30' : tip.icon.props.className.includes('orange') ? 'bg-orange-500/10 border-orange-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                        {tip.icon}
                      </div>
                      <h3 className="tip-title">{tip.title}</h3>
                    </div>
                    <p className="tip-description">{tip.description}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
                <h2 className="page-section-title"><LinkIcon className="inline-block mr-2 text-purple-400 -mt-1" />Contribute via Clear View</h2>
                <p className="page-text-content mt-3">
                    Using the <strong>Clear View</strong> app is a direct way to contribute! By reporting pollution and helping to identify problem areas, you provide valuable data that can lead to real-world solutions. 
                    Encourage others to use the app and spread awareness about local environmental issues.
                </p>
            </section>
          </div>
          <div className="p-6 md:p-8 border-t modern-card-footer text-center">
            <p className="page-text-content">
              Every small action, when multiplied by millions, creates a significant impact. Let's work together!
            </p>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <Footer />
      <style>{`
        .contribute-page-root { /* For scoping */ }

        .animate-fade-in-up {
          animation: fadeInAnimation 0.7s ease-out forwards, slideUpAnimation 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpAnimation { from { transform: translateY(25px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

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
          /* margin-bottom: 0.75rem; */
          padding-bottom: 0.3rem;
          /* border-bottom: 2px solid rgba(107, 142, 35, 0.3); */
          /* display: inline-block; */
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

        /* Tip Card Specific Styling */
        .tip-card {
          background-color: rgba(20, 28, 40, 0.75);
          padding: 1.25rem; /* 20px */
          border-radius: 0.875rem; /* 14px */
          border: 1px solid rgba(107, 142, 35, 0.15);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .tip-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
          border-color: rgba(107, 142, 35, 0.35);
        }
        .tip-icon-wrapper {
          border-radius: 50%;
          padding: 0.5rem; /* 8px */
          display: inline-flex;
          border-width: 1px;
        }
        .tip-title {
          font-size: 1.1rem; /* 17.6px */
          font-weight: 600;
          color: #e5e7eb;
        }
        .tip-description {
          font-size: 0.875rem; /* 14px */
          color: #a8b5c7;
          line-height: 1.65;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .page-main-title { font-size: 1.8rem; }
          .page-subtitle { font-size: 1rem; }
          .page-section-title { font-size: 1.35rem; }
          .modern-glass-page-card { padding: 1rem; border-radius: 1rem; }
          .tip-card { padding: 1rem; }
          .page-section-title {
             font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContributePage; 