import { Link } from 'react-router';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterTypeDialog from '../components/RegisterTypeDialog';
import MobileBottomNav from '../components/MobileBottomNav';
import { useState } from 'react';

const Home = () => {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  
  return (
    <div className="home-root flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow">
        <div className="flex flex-col min-h-screen">
            <section className=" rounded-b-3xl px-6 py-16 md:py-24">
                <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#1A1F2C]">
                        Empowering a
                        <br />
                        <span className="greener">Greener</span>
                        <br />
                        Tomorrow
                    </h1>
                    <p className="text-lg text-gray-700">
                        Join us in creating a sustainable world through simple, impactful actions for a cleaner, healthier planet.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="eco-button-primary" onClick={() => setRegisterDialogOpen(true)}>
                            Join Now
                        </button>
                        <Link to="/map-view">
                        <button variant="outline" className="eco-button-secondary">
                            Explore More
                        </button>
                        </Link>
                    </div>
                    </div>
                    <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                        <img 
                        src="/assets/city.jpeg" alt="UI-Image 1" 
                        className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8"
                        />
                        <img 
                        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500" 
                        alt="UI-Image 2" 
                        className="rounded-2xl shadow-lg w-full h-64 object-cover"
                        />
                    </div>
                    </div>
                </div>
                </div>
            </section>

            <section className="py-16 md:py-24 px-6">
                <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose us?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                    Our community-powered platform provides the tools needed to track pollution and take action in your local area.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="eco-card">
                    <div className="h-12 w-12 bg-[#F2FCE2] rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Radical Simplicity</h3>
                    <p className="text-gray-600">
                        No app download required – low barrier to entry for all community members.
                    </p>
                    </div>

                    <div className="eco-card">
                    <div className="h-12 w-12 bg-[#F2FCE2] rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Hyperlocal Focus</h3>
                    <p className="text-gray-600">
                        Directly addresses pollution affecting your immediate community.
                    </p>
                    </div>

                    <div className="eco-card">
                    <div className="h-12 w-12 bg-[#F2FCE2] rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Community-Powered</h3>
                    <p className="text-gray-600">
                        Democratizes environmental monitoring through collective citizen action.
                    </p>
                    </div>
                </div>
                </div>
            </section>

            <section className=" py-16 md:py-24 px-6">
                <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                    Our streamlined process makes it easy to report and track pollution in your community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl font-bold text-[#6B8E23]">1</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Report Pollution</h3>
                    <p className="text-gray-600">
                        Use our simple form to report pollution incidents in your area.
                    </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl font-bold text-[#6B8E23]">2</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Automatic Geotagging</h3>
                    <p className="text-gray-600">
                        Your location is automatically captured to pinpoint the pollution source.
                    </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl font-bold text-[#6B8E23]">3</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Visualize Data</h3>
                    <p className="text-gray-600">
                        Reports appear on our interactive map showing pollution hotspots.
                    </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl font-bold text-[#6B8E23]">4</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Take Action</h3>
                    <p className="text-gray-600">
                        Local authorities and community groups can use the data to address issues.
                    </p>
                    </div>
                </div>
                </div>
            </section>

            <section className="py-16 md:py-24 px-6">
                <div className="max-w-4xl mx-auto bg-[#1A1F2C] text-white rounded-3xl p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
                <p className="text-xl mb-8">
                    Join our community of environmental tracking and reporting pollution across India
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="bg-[#6B8E23] hover:bg-[#556B2F] text-white font-semibold py-3 px-8 rounded-full text-lg" 
                            onClick={() => setRegisterDialogOpen(true)}>
                        Create Account
                    </button>
                    <Link to="/report">
                        <button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1A1F2C] font-semibold py-3 px-8 rounded-full text-lg transition-colors">
                            Report Pollution
                        </button>
                    </Link>
                </div>
                </div>
            </section>

            <RegisterTypeDialog 
                isOpen={registerDialogOpen}
                onOpenChange={setRegisterDialogOpen}
            />
        </div>
      </main>

      <style jsx>{`
      /* === 2025 Modern SaaS Dark Theme for Home Page (scoped) === */

        .home-root, .home-root * {
        box-sizing: border-box;
        }

        .greener{
        color:rgb(137, 255, 108) !important;
        background-color: rgba(12, 21, 10, 0.51) !important;
        }

        .home-root {
        background: linear-gradient(135deg, #181c24 0%, #232a34 100%) !important;
        color: #f3f6fa;
        font-family: 'Inter', 'Poppins', 'Segoe UI', 'system-ui', sans-serif;
        min-height: 100vh;
        }

        /* Hero Section */
        .home-root section.bg-\[\#F2FCE2\] {
        background: rgba(30,34,44,0.85) !important;
        backdrop-filter: blur(8px) saturate(1.2);
        border-bottom-left-radius: 2.5rem;
        border-bottom-right-radius: 2.5rem;
        box-shadow: 0 8px 40px 0 rgba(0,0,0,0.25);
        }

        .home-root h1, .home-root h2, .home-root h3, .home-root h4, .home-root h5, .home-root h6 {
        color: #fff !important;
        font-family: 'Poppins', 'Inter', 'Segoe UI', 'system-ui', sans-serif;
        font-weight: 800;
        letter-spacing: -0.02em;
        }
        .home-root h1.text-5xl.md\:text-6xl.font-bold {
        font-size: 3.5rem;
        line-height: 1.1;
        text-shadow: 0 4px 32px #beef5c88, 0 1px 16px #000;
        }

        .home-root p, .home-root .text-gray-600, .home-root .text-gray-700 {
        color: #d1d5db !important;
        font-size: 1.18rem;
        line-height: 1.8;
        font-weight: 500;
        }

        /* Glassmorphism Card */
        .home-root .eco-card {
        background: rgba(36, 41, 54, 0.85) !important;
        border-radius: 1.5rem;
        box-shadow: 0 8px 40px 0 rgba(0,0,0,0.25), 0 0 0 2px rgba(107,142,35,0.08);
        border: 2.5px solid rgba(107,142,35,0.18);
        backdrop-filter: blur(10px) saturate(1.3);
        color: #f3f6fa;
        transition: box-shadow 0.4s, border 0.4s, transform 0.4s;
            position: relative;
        overflow: hidden;
        }
        .home-root .eco-card:hover {
        box-shadow: 0 16px 48px 0 #6B8E23, 0 0 0 4px #6B8E23;
        border: 2.5px solid #6B8E23;
        transform: translateY(-8px) scale(1.03);
        }
        .home-root .eco-card::before {
            content: '';
            position: absolute;
        top: -40%; left: -40%; width: 180%; height: 180%;
        background: radial-gradient(circle at 60% 40%, #6B8E23 0%, transparent 70%);
        opacity: 0.08;
        pointer-events: none;
        z-index: 0;
        }

        /* Card Headings */
        .home-root .eco-card h3 {
        color: #fff;
        font-size: 1.45rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        text-shadow: 0 2px 12px #6B8E23;
        }

        /* Buttons - Neon/Gradient Borders, Glow on Hover */
        .home-root .eco-button-primary, .home-root .eco-button-secondary, .home-root button, .home-root .eco-card button {
        font-family: inherit;
        font-size: 1.18rem;
        font-weight: 700;
        border-radius: 9999px;
        border: 2.5px solid #6B8E23;
        background: linear-gradient(90deg, #6B8E23 0%, #8BC34A 100%);
        color: #fff;
        box-shadow: 0 2px 16px 0 #6B8E23;
        transition: box-shadow 0.3s, border 0.3s, background 0.3s, color 0.3s, transform 0.3s;
        position: relative;
        overflow: hidden;
        }
        .home-root .eco-button-primary:hover, .home-root .eco-button-secondary:hover, .home-root button:hover, .home-root .eco-card button:hover {
        background: linear-gradient(90deg, #8BC34A 0%, #6B8E23 100%);
        color: #fff;
        border: 2.5px solid #fff;
        box-shadow: 0 0 16px 2px #8BC34A, 0 0 32px 8px #6B8E23;
        transform: scale(1.05);
        }

        /* Secondary Button - Transparent with animated border */
        .home-root .eco-button-secondary {
        background: transparent !important;
        color: #8BC34A !important;
        border: 2.5px solid #8BC34A !important;
        }
        .home-root .eco-button-secondary:hover {
        background: linear-gradient(90deg, #232a34 0%, #6B8E23 100%) !important;
        color: #fff !important;
        border: 2.5px solid #fff !important;
        }

        /* Hero Images - Glow and scale on hover */
        .home-root .grid.grid-cols-2.gap-4 img {
        border-radius: 1.25rem;
        box-shadow: 0 4px 32px 0 #6B8E23, 0 2px 16px 0 #232a34;
        transition: box-shadow 0.4s, transform 0.4s;
        }
        .home-root .grid.grid-cols-2.gap-4 img:hover {
        box-shadow: 0 8px 48px 0 #8BC34A, 0 4px 32px 0 #6B8E23;
        transform: scale(1.07) translateY(-8px) rotate(1.2deg);
        }

        /* How It Works Steps - Neon Circles */
        .home-root div.flex.flex-col.items-center.text-center > div.h-16.w-16 {
        background: linear-gradient(135deg, #232a34 0%, #6B8E23 100%) !important;
        color: #fff !important;
        box-shadow: 0 4px 24px 0 #6B8E23, 0 2px 8px 0 #232a34;
        border: 2.5px solid #6B8E23;
        font-size: 2.1rem;
        font-weight: 800;
        transition: box-shadow 0.3s, border 0.3s, background 0.3s, color 0.3s, transform 0.3s;
        }
        .home-root div.flex.flex-col.items-center.text-center:hover > div.h-16.w-16 {
        background: linear-gradient(135deg, #6B8E23 0%, #232a34 100%) !important;
        color: #fff !important;
        border: 2.5px solid #fff;
        box-shadow: 0 8px 32px 0 #8BC34A, 0 4px 24px 0 #6B8E23;
        transform: scale(1.18) translateY(-7px);
        }
        .home-root div.flex.flex-col.items-center.text-center:hover > div.h-16.w-16 span {
        color: #fff !important;
        text-shadow: 0 2px 8px #8BC34A;
        }

        /* CTA Section Box (Ready to Make a Difference?) */
        .home-root section > div.bg-\[\#1A1F2C\] {
        background: linear-gradient(120deg, #232a34 0%, #181c24 100%) !important;
        box-shadow: 0 18px 40px rgba(0,0,0,0.5), 0 0 0 2.5px #6B8E23;
        border-radius: 2rem;
        border: 2.5px solid #232a34;
        color: #fff;
        }
        .home-root section > div.bg-\[\#1A1F2C\] h2, .home-root section > div.bg-\[\#1A1F2C\] p {
        color: #fff !important;
        text-shadow: 0 2px 12px #6B8E23;
        }

        /* Responsive Headings */
        @media (max-width: 600px) {
        h1.text-5xl, h1.md\:text-6xl { font-size: 2.3rem; }
        h2.text-3xl, h2.md\:text-4xl { font-size: 1.55rem; }
        }

        /* Mobile Bottom Nav Styles */
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 50;
            background: rgba(36, 41, 54, 0.92);
            backdrop-filter: blur(12px) saturate(1.2);
            box-shadow: 0 -2px 24px 0 #6B8E23, 0 0 0 2px #232a34;
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
            padding: 0.5rem 0.5rem 0.7rem 0.5rem;
            justify-content: space-around;
            align-items: center;
          }
          .mobile-nav-item {
            flex: 1 1 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #d1d5db;
            font-size: 0.98rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 1.2rem;
            padding: 0.3rem 0.2rem 0.1rem 0.2rem;
            transition: color 0.22s, background 0.22s, box-shadow 0.22s;
            position: relative;
          }
          .mobile-nav-item .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.1rem;
            font-size: 1.45rem;
            color: #8BC34A;
            transition: color 0.22s, filter 0.22s;
          }
          .mobile-nav-item .label {
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.01em;
          }
          .mobile-nav-item:active, .mobile-nav-item:focus, .mobile-nav-item:hover {
            background: linear-gradient(90deg, #232a34 0%, #6B8E23 100%);
            color: #fff;
            box-shadow: 0 2px 16px 0 #6B8E23;
          }
          .mobile-nav-item:active .icon, .mobile-nav-item:focus .icon, .mobile-nav-item:hover .icon {
            color: #fff;
            filter: drop-shadow(0 0 6px #8BC34A);
          }
        }
      `}</style>

      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default Home;
