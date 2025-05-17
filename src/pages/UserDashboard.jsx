import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

const UserDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          toast.error("Please log in to access the user dashboard.");
          return navigate("/login");
        }
  
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists() || userDoc.data()?.role === "admin") {
            toast.error("Access denied. Users only.");
            return navigate("/login");
          }

          if (!user.uid || user.uid !== id) {
            toast.error("Access denied.");
            return navigate("/login");
          }

          setUser({ id: userDoc.id, ...userDoc.data() });
        } 
        catch (err) {
          console.error("Error checking user role:", err);
          toast.error("An error occurred while checking access.");
          return navigate("/login");
        }
      });
  
      return () => unsubscribe();
  
  }, [navigate, id]);

  const loadReports = async () => {
      try {
        if (!user?.uid) return;

        const q = query(collection(db, "reports"), where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const userReports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReports(userReports);
      } 
      catch (error) {
        console.error("Error loading reports:", error);
        toast.error("Failed to load reports");
      } 
  };
  

  useEffect(() => {
    loadReports();
  }, [user?.uid]);
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17]">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-6">
            <svg className="animate-spin h-12 w-12 text-[#6B8E23] mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-white">Loading profile...</h2>
            <p className="text-gray-400 mt-2">Please wait a moment.</p>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }
  
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'approved';
      case 'rejected': return 'rejected';
      case 'forwarded': return 'forwarded';
      case 'pending': return 'pending';
      default: return 'default';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
        <NavBar />
  
        <main className="flex-grow py-8 px-4 md:px-8 bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17] dark relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl z-0 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="modern-glass-card p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="modern-avatar-bg mb-5">
                      <span className="modern-avatar-initial">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <h2 className="modern-user-name mb-1">{user.name}</h2>
                    <p className="modern-user-uid mb-4">UID: {user.uid}</p>
                    
                    <div className="modern-user-role mb-6">
                      {user.role === 'admin' ? 'Administrator' : 'Community Member'}
                    </div>
                    
                    <div className="w-full border-t modern-divider pt-6 mt-4 space-y-3">
                      <div className="flex justify-between items-center modern-user-stat">
                        <span>Total Points:</span>
                        <span className="font-bold text-lg">{user.points}</span>
                      </div>
                      
                      <div className="flex justify-between items-center modern-user-stat">
                        <span>Reports Submitted:</span>
                        <span className="font-bold text-lg">{reports.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center modern-user-stat">
                        <span>Member Since:</span>
                        <span className="font-bold text-lg">
                          {new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className="modern-button w-full mt-8"
                      onClick={() => navigate('/report')}
                    >
                      Submit New Report
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Your Reports</h3>
                
                {reports.length === 0 ? (
                  <div className="modern-glass-card p-8 text-center modern-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008zM9.75 9.75c0-1.036.84-1.875 1.875-1.875H13.5c1.036 0 1.875.84 1.875 1.875v1.125c0 1.036-.84 1.875-1.875 1.875h-.375a1.875 1.875 0 01-1.875-1.875V9.75z" />
                    </svg>
                    <h4 className="text-xl font-semibold mb-2 text-white">No Reports Yet</h4>
                    <p className="text-gray-400 mb-6">
                      You haven't submitted any pollution reports. <br/>Be the first to make a difference!
                    </p>
                    <Button 
                      className="modern-button"
                      onClick={() => navigate('/report')}
                    >
                      Submit Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-5">
                    {reports.map((report, index) => (
                      <div key={report.id} className="modern-report-item-card animate-slide-up" style={{ animationDelay: `${200 + index * 50}ms` }}>
                        <div className="flex justify-between items-start mb-2.5">
                          <h4 className="modern-report-title">{report.type}</h4>
                          <span className={`modern-badge ${getStatusBadgeClass(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="modern-report-desc mb-3">{report.description}</p>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs modern-report-meta">
                          <span>Submitted: {new Date(report.timestamp.seconds * 1000).toLocaleDateString()}</span>
                          <span>Location: {report.location.latitude.toFixed(3)}°, {report.location.longitude.toFixed(3)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </main>
  
        <MobileBottomNav />
        <Footer />
        <style>{`
          /* General Animations */
          .animate-fade-in { animation: fadeInAnimation 0.6s ease-out forwards; }
          .animate-slide-up { animation: slideUpAnimation 0.5s ease-out forwards; }
          @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUpAnimation { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

          /* Modern Glass Card (Base for User Profile & Empty State) */
          .modern-glass-card {
            background: rgba(30, 36, 49, 0.75); /* Slightly bluish dark slate */
            border-radius: 1.25rem; /* 20px */
            border: 1.5px solid rgba(107, 142, 35, 0.25);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(12px) saturate(1.6);
            padding: 1.75rem; /* 28px */
            color: #e0e5ec; /* Light neutral text */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .modern-glass-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          }

          /* User Profile Specific Styles */
          .modern-avatar-bg {
            width: 7rem; height: 7rem; /* 112px */
            border-radius: 50%;
            background: linear-gradient(145deg, rgba(107, 142, 35, 0.3), rgba(85, 107, 47, 0.5));
            display: flex; align-items: center; justify-content: center;
            border: 3px solid rgba(107, 142, 35, 0.5);
            box-shadow: 0 4px 15px rgba(107, 142, 35, 0.2);
          }
          .modern-avatar-initial {
            font-size: 3rem; /* 48px */
            font-weight: bold;
            color: #f0f0f0;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
          .modern-user-name { font-size: 1.75rem; font-weight: 700; color: #ffffff; text-shadow: 0 1px 4px rgba(107,142,35,0.2); }
          .modern-user-uid { font-size: 0.8rem; color: #a0a8b3; letter-spacing: 0.05em; }
          .modern-user-role {
            background: rgba(107, 142, 35, 0.2);
            color: #d4e0c4; /* Light olive text */
            padding: 0.3rem 0.8rem;
            border-radius: 1rem; /* Pill shape */
            font-size: 0.8rem; font-weight: 500;
            border: 1px solid rgba(107, 142, 35, 0.4);
          }
          .modern-divider { border-color: rgba(107, 142, 35, 0.3) !important; }
          .modern-user-stat span:first-child { color: #b0b8c4; font-size: 0.9rem; }
          .modern-user-stat span:last-child { color: #e0e5ec; font-size: 1.1rem; }

          /* Your Reports Section */
          .modern-empty-state .text-gray-500 { color: #8a94a2 !important; } /* Override Tailwind for SVG */
          .modern-empty-state .text-gray-400 { color: #a0a8b3 !important; } /* Override Tailwind for P tag */

          /* Report Item Card */
          .modern-report-item-card {
            background: rgba(40, 48, 65, 0.7); /* Slightly different shade for items */
            border-radius: 1rem; /* 16px */
            padding: 1.25rem; /* 20px */
            border: 1px solid rgba(107, 142, 35, 0.2);
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            backdrop-filter: blur(10px) saturate(1.4);
            transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
          }
          .modern-report-item-card:hover {
            transform: translateX(5px) scale(1.01);
            background-color: rgba(45, 55, 75, 0.8);
            box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            border-color: rgba(107, 142, 35, 0.35);
          }
          .modern-report-title { font-size: 1.2rem; font-weight: 600; color: #ffffff; margin-bottom: 0.25rem;}
          .modern-report-desc { font-size: 0.9rem; color: #b8c0cc; line-height: 1.5; }
          .modern-report-meta { color: #8a94a2; font-size: 0.75rem; }
          .modern-report-meta span { margin-top: 0.25rem; }

          /* Modern Button */
          .modern-button {
            background: linear-gradient(135deg, #6B8E23 0%, #556B2F 100%);
            color: white !important; /* ensure high contrast */
            font-weight: 600;
            font-size: 0.95rem;
            border-radius: 0.75rem; /* 12px */
            padding: 0.65rem 1.5rem;
            transition: all 0.3s ease;
            border: none;
            box-shadow: 0 4px 15px rgba(107,142,35,0.25), 0 0 0 1px rgba(255,255,255,0.05) inset;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .modern-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(107,142,35,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset;
            background: linear-gradient(135deg, #7ba031 0%, #637c38 100%);
          }

          /* Modern Badge (for report status) */
          .modern-badge {
            padding: 0.3rem 0.75rem;
            border-radius: 0.875rem; /* 14px, more pill-like */
            font-size: 0.7rem; font-weight: bold;
            text-transform: uppercase; letter-spacing: 0.02em;
            border: 1px solid;
            min-width: 70px; text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .modern-badge.approved { background-color: rgba(76, 175, 80, 0.2); color: #81c784; border-color: rgba(76, 175, 80, 0.5); }
          .modern-badge.rejected { background-color: rgba(244, 67, 54, 0.15); color: #ef9a9a; border-color: rgba(244, 67, 54, 0.4); }
          .modern-badge.pending { background-color: rgba(255, 193, 7, 0.15); color: #ffd54f; border-color: rgba(255, 193, 7, 0.4); }
          .modern-badge.forwarded { background-color: rgba(33, 150, 243, 0.15); color: #90caf9; border-color: rgba(33, 150, 243, 0.4); }
          .modern-badge.default { background-color: rgba(108, 117, 125, 0.2); color: #adb5bd; border-color: rgba(108, 117, 125, 0.4); }

        `}</style>
    </div>
    
  );
};

export default UserDashboard;