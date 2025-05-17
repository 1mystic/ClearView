import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from "../config/firebase";
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import RegisterTypeDialog from "./RegisterTypeDialog";
import { Button } from './ui/button';

function Navbar() {
  
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() };
            setUser(userData);
            if (userData.role === "admin") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else {
            setUser({ uid: currentUser.uid });
            setIsAdmin(false);
          }
        } 
        catch (error) {
          console.error("Error checking user role:", error);
          setUser({ uid: currentUser.uid });
          setIsAdmin(false);
        }
      } 
      else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } 
    catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <header className="bg-slate-900/90 backdrop-blur-md text-slate-200 py-3 sm:py-4 px-6 md:px-12 shadow-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8 sm:h-9 sm:w-9 animate-pulse" />
            <span className="font-semibold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400">
              Clear View
            </span>
          </div>
          <div className="h-6 w-24 bg-slate-700 rounded-md animate-pulse"></div>
        </div>
      </header>
    );
  }

  const navLinkClasses = (path) => 
    `font-medium text-slate-300 hover:text-emerald-300 transition-colors duration-200 ease-in-out relative group px-2 py-1
     ${isActive(path) ? "text-emerald-300 after:w-2/3" : "after:w-0 after:group-hover:w-2/3"}
     after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-2px] after:h-[2px] after:bg-emerald-400 after:transition-all after:duration-300 after:rounded-full`;

  return (
    <>
      <header className="bg-slate-900/90 backdrop-blur-md text-slate-200 py-3 sm:py-4 px-6 md:px-12 shadow-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-8 w-8 sm:h-9 sm:w-9"
            />
            <span className="font-semibold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400">
              Clear View
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7">
            {!isAuthenticated && (
              <>
                <Link to="/map-view" className={navLinkClasses("/map-view")}>Map</Link>
                <Link to="/report" className={navLinkClasses("/report")}>Report</Link>
              </>
            )}   
            {isAuthenticated && isAdmin && (
              <>
                <Link to="/admin" className={navLinkClasses("/admin")}>Dashboard</Link>
                <Link to="/map-view" className={navLinkClasses("/map-view")}>Map</Link>
                <Link to="/ngo-invite" className={navLinkClasses("/ngo-invite")}>NGO Invite</Link>
                <Link to="/leaderboard" className={navLinkClasses("/leaderboard")}>Leaderboard</Link>
              </>
            )}
            {isAuthenticated && !isAdmin && user?.id && (
              <>
                <Link to={`/user-dashboard/${user.id}`} className={navLinkClasses(`/user-dashboard/${user.id}`)}>Dashboard</Link>
                <Link to="/map-view" className={navLinkClasses("/map-view")}>Map</Link>
                <Link to="/report" className={navLinkClasses("/report")}>Report</Link>
                <Link to="/leaderboard" className={navLinkClasses("/leaderboard")}>Leaderboard</Link>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated ? (
              <button
                className="font-medium text-slate-300 hover:text-emerald-300 px-3 py-2 rounded-lg hover:bg-slate-700/70 transition-all duration-200"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">
                  <div
                    className="login text-slate-200"
                  >
                    Login
                  </div>
                </Link>
                <div
                  className="logout"
                  onClick={() => setRegisterDialogOpen(true)}
                >
                  Get Started
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <RegisterTypeDialog 
          isOpen={registerDialogOpen}
          onOpenChange={setRegisterDialogOpen}
        />
    
    <style jsx>{`
      .login, .logout {
        padding: 0.55rem 1.35rem;
        border-radius: 50px;
        font-weight: 500;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        border: 1.5px solid transparent;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        text-decoration: none;
        line-height: 1.4;
        white-space: nowrap;
      }

      .login {
        background-color: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.15);
        color: #D1D5DB;
      }

      .login:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-color: #6B8E23;
        color: #F0FFF0;
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(107, 142, 35, 0.1);
      }

      .logout {
        background-image: linear-gradient(100deg,rgb(84, 175, 54), #86A364);
        color: white;
        box-shadow: 0 4px 12px rgba(148, 180, 85, 0.65), 0 1px 3px rgba(0,0,0,0.1);
        border: none;
      }

      .logout:hover {
        background-image: linear-gradient(100deg, #556B2F, #6B8E23);
        transform: translateY(-1.5px) scale(1.02);
        box-shadow: 0 6px 18px rgba(85, 107, 47, 0.3), 0 2px 5px rgba(0,0,0,0.15);
      }
      .logout:active {
        transform: translateY(0px) scale(0.98);
        box-shadow: 0 2px 8px rgba(85, 107, 47, 0.25);
      }
      `}
    </style>
    </>
  )
}

export default Navbar