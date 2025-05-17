import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

const Register = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let valid = true;

    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      valid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords don't match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);   
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          role: "user",
          createdAt: new Date(),
          points: 0,
        });
        navigate(`/user-dashboard/${user.uid}`);
      } 
      catch (error) {
        console.error('Registration error:', error);
      } 
      finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
          <div className="w-full max-w-lg modern-glass-register-card animate-fade-in animate-slide-up">
            <div className="text-center p-6 md:p-8 border-b modern-card-header">
              <h2 className="modern-title">Create Your Account</h2>
              <p className="modern-subtitle">Join Clear View and help make a difference</p>
            </div>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="modern-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="modern-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {errors.name && (
                    <p className="modern-error-text mt-1">{errors.name}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div className="space-y-1.5">
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
                    <p className="modern-error-text mt-1">{errors.email}</p>
                  )}
                </div>
                
                {/* Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="modern-label">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a strong password"
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
                    <p className="modern-error-text mt-1">{errors.password}</p>
                  )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="modern-label">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="modern-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-150"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 modern-input-icon" />
                      ) : (
                        <Eye className="h-5 w-5 modern-input-icon" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="modern-error-text mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="modern-button w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2.5 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>
            </div>
            <div className="p-6 md:p-8 border-t modern-card-footer text-center">
              <div className="modern-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="modern-link">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
      </main>

      <MobileBottomNav />
      <Footer />
      <style>{`
        /* General Page Animations (same as Login) */
        .animate-fade-in { animation: fadeInAnimation 0.7s ease-out forwards; }
        .animate-slide-up { animation: slideUpAnimation 0.6s ease-out forwards; animation-delay: 0.1s; }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpAnimation { from { transform: translateY(30px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

        /* Register Card Styling (similar to Login card) */
        .modern-glass-register-card {
          background: rgba(25, 32, 45, 0.82); /* Slightly adjusted alpha or color if desired */
          border-radius: 1.5rem; /* 24px */
          border: 1.5px solid rgba(107, 142, 35, 0.28); /* Accent border, maybe slightly more prominent */
          box-shadow: 0 10px 45px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.03) inset;
          backdrop-filter: blur(18px) saturate(1.8);
          color: #e3e9f0; /* Light text */
          width: 100%;
          max-width: 32rem; /* Slightly wider for more fields */
        }
        .modern-card-header {
          border-color: rgba(107, 142, 35, 0.22) !important;
        }
        .modern-title {
          font-size: 1.75rem; /* 28px */
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 6px rgba(107,142,35,0.35);
          line-height: 1.3;
        }
        .modern-subtitle {
          font-size: 0.9rem; /* 14.4px */
          color: #b8c8d8; /* Softer light text */
          margin-top: 0.4rem;
        }

        /* Form Element Styling (reused and adapted from Login) */
        .modern-label {
          font-size: 0.875rem; /* 14px */
          font-weight: 500;
          color: #c8d4e0;
          display: block;
          margin-bottom: 0.35rem;
        }
        .modern-input-icon {
          color: #788898; /* Slightly adjusted icon color */
          transition: color 0.2s ease;
        }
        .modern-input {
          width: 100%;
          padding: 0.8rem 0.8rem 0.8rem 2.75rem; 
          background-color: rgba(12, 20, 30, 0.75); 
          border: 1.5px solid rgba(107, 142, 35, 0.3);
          border-radius: 0.625rem; /* 10px */
          color: #e3e9f0;
          font-size: 0.95rem; /* 15px */
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .modern-input::placeholder {
          color: #708090; 
          opacity: 0.75;
        }
        .modern-input:focus {
          background-color: rgba(18, 26, 38, 0.85);
          border-color: #7BA031; /* Brighter accent for focus */
          box-shadow: 0 0 0 3.5px rgba(107, 142, 35, 0.25);
        }
        /* Icon color change on focus of sibling input */
        .modern-input:focus ~ .modern-input-icon, 
        .modern-input:not(:placeholder-shown) ~ .modern-input-icon { /* Keep icon colored if input has value */
            color: #97B85C; 
        }
        .modern-input:hover {
           border-color: rgba(107, 142, 35, 0.5);
        }
        /* Adjust Eye icon button specifically */
        .modern-input ~ button .modern-input-icon {
            color: #788898;
        }
        .modern-input:focus ~ button .modern-input-icon,
        .modern-input:not(:placeholder-shown) ~ button .modern-input-icon {
            color: #97B85C;
        }
        .modern-input ~ button:hover .modern-input-icon {
             color: #a8c868;
        }


        .modern-error-text {
          font-size: 0.78rem; /* 12.5px */
          color: #ff9090; /* Slightly softer light red */
          font-weight: 500;
          padding-left: 0.2rem;
        }

        /* Button Styling (reused from Login) */
        .modern-button {
          width: 100%;
          padding: 0.85rem 1rem; /* Slightly more padding */
          background: linear-gradient(135deg, #6B8E23 0%, #556B2F 100%);
          color: white !important;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 0.625rem; /* 10px */
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(107,142,35,0.28), 0 0 0 1px rgba(255,255,255,0.04) inset;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin-top: 1.25rem; /* Added margin-top */
        }
        .modern-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(107,142,35,0.38), 0 0 0 1px rgba(255,255,255,0.07) inset;
          background: linear-gradient(135deg, #7aa829 0%, #607736 100%);
        }
        .modern-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .modern-button svg {
          vertical-align: middle;
        }

        /* Footer Link Styling (reused from Login) */
        .modern-card-footer {
          border-color: rgba(107, 142, 35, 0.18) !important;
          background-color: rgba(12, 20, 30, 0.35);
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
        }
        .modern-footer-text {
          font-size: 0.9rem;
          color: #b8c8d8;
        }
        .modern-link {
          font-weight: 600;
          color: #97B85C; /* Bright accent for link */
          transition: color 0.2s ease, text-shadow 0.2s ease;
        }
        .modern-link:hover {
          color: #adc878; /* Lighter on hover */
          text-decoration: underline;
          text-shadow: 0 0 10px rgba(173, 200, 120, 0.35);
        }
      `}</style>
    </div>
  );
};

export default Register;
