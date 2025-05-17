import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { onAuthStateChanged } from "firebase/auth";
import MobileBottomNav from '../components/MobileBottomNav';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let valid = true;

    const newErrors = {
      email: '',
      password: '',
    };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted:');

    if (!validateForm()) {
      return;
    }

    console.log('Form is valid, proceeding with login...');
    
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log('User signed in:', userCredential.user);

      const user = userCredential.user;
      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        console.log('User role:', role);

        if (role !== "admin") {
          navigate(`/user-dashboard/${user.uid}`);
        } 
        else {
          navigate('/admin');
        }
      }
    } 
    catch (error) {
      console.error('Login error:', error);
    } 
    finally {
      setIsSubmitting(false);
    }
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
          {/* Optional: Add some subtle background animated shapes or particles here if desired */}
          {/* <div className="absolute inset-0 z-0 opacity-10"> ... </div> */}
          
          <div className="w-full max-w-md modern-glass-login-card animate-fade-in animate-slide-up">
            <div className="text-center p-6 md:p-8 border-b modern-card-header">
              <h2 className="modern-title">Welcome Back</h2>
              <p className="modern-subtitle">Sign in to continue your journey</p>
            </div>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="modern-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="modern-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="modern-error-text mt-1.5">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="modern-label">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="modern-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-150"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 modern-input-icon" />
                      ) : (
                        <Eye className="h-5 w-5 modern-input-icon" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="modern-error-text mt-1.5">{errors.password}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="modern-button w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2.5 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
            <div className="p-6 md:p-8 border-t modern-card-footer text-center">
              <div className="modern-footer-text">
                Don\'t have an account?{' '}
                <Link to="/register" className="modern-link">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
      </main>

      <MobileBottomNav />
      <Footer />
      <style>{`
        /* General Page Animations */
        .animate-fade-in { animation: fadeInAnimation 0.7s ease-out forwards; }
        .animate-slide-up { animation: slideUpAnimation 0.6s ease-out forwards; animation-delay: 0.1s; }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpAnimation { from { transform: translateY(30px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

        /* Login Card Styling */
        .modern-glass-login-card {
          background: rgba(25, 32, 45, 0.8); /* Dark, slightly desaturated blue */
          border-radius: 1.5rem; /* 24px */
          border: 1.5px solid rgba(107, 142, 35, 0.25); /* Accent border */
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
          backdrop-filter: blur(16px) saturate(1.7);
          color: #e1e8f0; /* Light text */
        }
        .modern-card-header {
          border-color: rgba(107, 142, 35, 0.2) !important;
        }
        .modern-title {
          font-size: 1.8rem; /* 28px */
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 5px rgba(107,142,35,0.3);
        }
        .modern-subtitle {
          font-size: 0.95rem; /* 15px */
          color: #b0c0d0; /* Softer light text */
          margin-top: 0.3rem;
        }

        /* Form Element Styling */
        .modern-label {
          font-size: 0.9rem; /* 14px */
          font-weight: 500;
          color: #c5d1de;
          display: block;
          margin-bottom: 0.4rem;
        }
        .modern-input-icon {
          color: #708090; /* Slate gray for icons */
          transition: color 0.2s ease;
        }
        .modern-input {
          width: 100%;
          padding: 0.8rem 0.8rem 0.8rem 2.75rem; /* 13px padding, 44px for icon */
          background-color: rgba(15, 23, 35, 0.7); /* Very dark input bg */
          border: 1.5px solid rgba(107, 142, 35, 0.25);
          border-radius: 0.75rem; /* 12px */
          color: #e1e8f0;
          font-size: 1rem; /* 16px */
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .modern-input::placeholder {
          color: #708090; /* Slate gray placeholder */
          opacity: 0.8;
        }
        .modern-input:focus {
          background-color: rgba(20, 28, 40, 0.8);
          border-color: #6B8E23; /* Accent color focus */
          box-shadow: 0 0 0 3px rgba(107, 142, 35, 0.2);
        }
        .modern-input:focus + .modern-input-icon, .modern-input:hover + .modern-input-icon {
          color: #8FB04C; /* Brighter icon on focus/hover of related input */
        }
        .modern-input:hover {
           border-color: rgba(107, 142, 35, 0.45);
        }

        .modern-error-text {
          font-size: 0.8rem; /* 13px */
          color: #ff8080; /* Light red for errors */
          font-weight: 500;
        }

        /* Button Styling */
        .modern-button {
          width: 100%;
          padding: 0.8rem 1rem; /* 13px 16px */
          background: linear-gradient(135deg, #6B8E23 0%, #556B2F 100%);
          color: white !important;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 0.75rem; /* 12px */
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 5px 18px rgba(107,142,35,0.25), 0 0 0 1px rgba(255,255,255,0.04) inset;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          cursor: pointer;
        }
        .modern-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107,142,35,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset;
          background: linear-gradient(135deg, #7aa829 0%, #607736 100%);
        }
        .modern-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .modern-button svg {
          vertical-align: middle;
        }

        /* Footer Link Styling */
        .modern-card-footer {
          border-color: rgba(107, 142, 35, 0.15) !important;
          background-color: rgba(15, 23, 35, 0.3);
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
        }
        .modern-footer-text {
          font-size: 0.9rem;
          color: #b0c0d0;
        }
        .modern-link {
          font-weight: 600;
          color: #8FB04C; /* Bright accent for link */
          transition: color 0.2s ease, text-shadow 0.2s ease;
        }
        .modern-link:hover {
          color: #a8c868; /* Lighter on hover */
          text-decoration: underline;
          text-shadow: 0 0 8px rgba(137, 196, 244, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Login;
