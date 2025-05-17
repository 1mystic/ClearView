import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { db, auth } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getLeaderboard } from "../utils/services";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (!userDoc.exists()) {
              navigate("/login");
            } 
            else {
              setUser({ id: userDoc.id, ...userDoc.data() });
            }
          } 
          catch (error) {
            console.error("Error checking admin role:", error);
          }
        }
      });
  
      return () => unsubscribe();
  }, [navigate]);

  const loadLeaderboard = async () => {

    try {
      const leaderboardData = await getLeaderboard();
      setLeaderboardData(leaderboardData);
      console.log("Leaderboard Data:", leaderboardData);
    } 
    catch (error) {
      console.error("Error loading leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } 
    finally {
      setLoading(false);
    }
    
  };
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  const getUserRank = () => {
    if (!user) return null;
    
    const userIndex = leaderboardData.findIndex(entry => entry.name === user.name);
    if (userIndex === -1) return null;
    
    return {
      rank: userIndex + 1,
      count: leaderboardData[userIndex].count
    };
  };
  
  const userRank = getUserRank();
  
  return (
    <div className="flex flex-col min-h-screen">
        <NavBar />
  
        <main className="flex-grow py-6 px-6 md:px-12 bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17] dark relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 dark:bg-black/30 backdrop-blur-2xl z-0 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in animate-delay-100">
            <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Leaderboard</h1>
            
            <div className="modern-glass-card mb-8 animate-slide-up animate-delay-200">
              <div className="modern-card-content">
                <h2 className="modern-card-title mb-4">Top Contributors</h2>
                <div className="space-y-4">
                  {leaderboardData.map((user, index) => (
                    <div key={user.id} className="modern-leaderboard-item">
                      <div className="modern-rank">{index + 1}</div>
                      <div className="modern-user-info">
                        <span className="modern-username">{user.name}</span>
                        <span className="modern-points">{user.points} points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
  
        <MobileBottomNav />
        <Footer />

        <style>{`
          .modern-glass-card {
            background: rgba(36, 41, 54, 0.85);
            border-radius: 1.5rem;
            box-shadow: 0 8px 40px 0 rgba(0,0,0,0.25), 0 0 0 2px rgba(107,142,35,0.08);
            border: 2.5px solid rgba(107,142,35,0.18);
            backdrop-filter: blur(10px) saturate(1.3);
            color: #f3f6fa;
            transition: box-shadow 0.4s, border 0.4s, transform 0.4s, background 0.4s;
            position: relative;
            overflow: hidden;
            margin-bottom: 1.5rem;
            padding: 2rem 1.5rem;
          }
          .modern-card-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .modern-card-title {
            color: #fff;
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.01em;
            text-shadow: 0 2px 12px #6B8E23;
            margin-bottom: 0.25rem;
          }
          .modern-leaderboard-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 1rem;
            border: 1px solid rgba(107,142,35,0.2);
            transition: all 0.3s ease;
          }
          .modern-leaderboard-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(8px);
            border-color: rgba(107,142,35,0.4);
          }
          .modern-rank {
            width: 2.5rem;
            height: 2.5rem;
            background: linear-gradient(135deg, #6B8E23 0%, #556B2F 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
            color: white;
            margin-right: 1rem;
            box-shadow: 0 4px 15px rgba(107,142,35,0.3);
          }
          .modern-user-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex: 1;
          }
          .modern-username {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fff;
          }
          .modern-points {
            font-size: 1rem;
            font-weight: 500;
            color: #6B8E23;
            background: rgba(107,142,35,0.1);
            padding: 0.5rem 1rem;
            border-radius: 0.75rem;
          }
          .animate-delay-100 { animation-delay: 100ms; }
          .animate-delay-200 { animation-delay: 200ms; }
        `}</style>
    </div>
    
  );
};

export default Leaderboard;
