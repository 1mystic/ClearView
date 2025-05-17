import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, Building, Upload, Info, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '../components/ui/alert-dialog';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { serverTimestamp } from "firebase/firestore";
import MobileBottomNav from '../components/MobileBottomNav';

const NGORegister = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [document, setDocument] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    regNumber: '',
    document: ''
  });

  const validateForm = () => {
    let valid = true;

    const newErrors = {
      orgName: '',
      contactName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      regNumber: '',
      document: ''
    };

    if (!orgName) {
      newErrors.orgName = 'Organization name is required';
      valid = false;
    }

    if (!contactName) {
      newErrors.contactName = 'Contact person name is required';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } 
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } 
    else if (!/^\d{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    if (!regNumber) {
      newErrors.regNumber = 'Registration number is required';
      valid = false;
    }

    if (!document) {
      newErrors.document = 'Please upload your NGO registration certificate';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } 
    else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } 
    else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords don't match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (document.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          document: 'File size should not exceed 5MB'
        });
        return;
    }

    setErrors({
        ...errors,
        document: ''
    });
    
    setIsSubmitting(true);
    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);   
    const user = userCredential.user;

    const uploadedUrl = await handleFileChange();

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: orgName,
        role: "ngo",
        description: description,
        regNum: regNumber,
        contactPerson: contactName,
        contactNo: phone,
        createdAt: serverTimestamp(),
        approvalStatus: "pending",
        docProofURL: uploadedUrl || "",
        points: 0,
    });
    
    setSuccessDialogOpen(true);
    
    setOrgName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setDescription('');
    setRegNumber('');
    setDocument(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    
    toast.success("Registration submitted successfully!");
    } 
    catch (error) {
        toast.error('Registration failed. Please try again.');
        console.error('NGO Registration error:', error);
    } 
    finally {
        setIsSubmitting(false);
    }
    
  };

  const handleFileChange = async () => {
    if (!document) return; 

    const formData = new FormData();
    formData.append("file", document);
    formData.append("upload_preset", "clear-view-preset"); 
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); 

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
        });

        const data = await response.json();
        console.log("Cloudinary response:", data.secure_url, data.url, data);
        toast.success("Image uploaded successfully!");
        return data.secure_url;
    } 
    catch (err) {
        console.error("Cloudinary upload error:", err);
        toast.error("Failed to upload image.");
        return null;
    }
      
    
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <NavBar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="w-full max-w-3xl modern-glass-ngo-register-card animate-fade-in animate-slide-up">
          <div className="text-center p-6 md:p-8 border-b modern-card-header">
            <h2 className="modern-title">Register your Organization/NGO</h2>
            <p className="modern-subtitle">Join Clear View to collaborate on environmental initiatives</p>
          </div>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Organization Name Field */}
                <div className="space-y-1.5">
                  <label htmlFor="orgName" className="modern-label">Organization Name*</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="orgName" type="text" placeholder="Your Organization PLC" className="modern-input" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>
                  {errors.orgName && <p className="modern-error-text mt-1">{errors.orgName}</p>}
                </div>
                
                {/* Contact Person Field */}
                <div className="space-y-1.5">
                  <label htmlFor="contactName" className="modern-label">Contact Person*</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="contactName" type="text" placeholder="Full Name" className="modern-input" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                  </div>
                  {errors.contactName && <p className="modern-error-text mt-1">{errors.contactName}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="modern-label">Email Address*</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="email" type="email" placeholder="contact@organization.com" className="modern-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  {errors.email && <p className="modern-error-text mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="modern-label">Phone Number*</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="phone" pattern="\d{10}" maxLength={10} type="tel" placeholder="e.g., 1234567890" className="modern-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  {errors.phone && <p className="modern-error-text mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Organization Description Field */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="modern-label">Organization Description</label>
                <textarea id="description" placeholder="Brief description of your organization's mission and activities" className="modern-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Registration Number Field */}
                <div className="space-y-1.5">
                  <label htmlFor="regNumber" className="modern-label">NGO Registration Number*</label>
                  <div className="relative">
                    <Info className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="regNumber" type="text" placeholder="Your official registration ID" className="modern-input" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                  </div>
                  {errors.regNumber && <p className="modern-error-text mt-1">{errors.regNumber}</p>}
                </div>

                {/* Registration Certificate Upload Field */}
                <div className="space-y-1.5">
                  <label htmlFor="document" className="modern-label">Registration Certificate*</label>
                  <label htmlFor="document" className="modern-file-input-label">
                    <Upload className="h-5 w-5 modern-input-icon mr-2.5 flex-shrink-0" />
                    <span className="truncate block">
                      {document ? document.name : 'Upload certificate (PDF, JPG, PNG)'}
                    </span>
                  </label>
                  <input id="document" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" ref={fileInputRef} onChange={(e) => setDocument(e.target.files[0])} />
                  <p className="modern-input-hint">Max file size: 5MB</p>
                  {errors.document && <p className="modern-error-text mt-1">{errors.document}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
                {/* Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="modern-label">Password*</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="password" type={showPassword ? "text" : "password"} placeholder="Choose a strong password" className="modern-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-150" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-5 w-5 modern-input-icon" /> : <Eye className="h-5 w-5 modern-input-icon" />}
                    </button>
                  </div>
                  {errors.password && <p className="modern-error-text mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="modern-label">Confirm Password*</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 modern-input-icon" />
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" className="modern-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-150" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 modern-input-icon" /> : <Eye className="h-5 w-5 modern-input-icon" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="modern-error-text mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="pt-4">
                <button type="submit" className="modern-button w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2.5 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="p-6 md:p-8 border-t modern-card-footer text-center">
            <div className="modern-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="modern-link">Sign In</Link>
            </div>
          </div>
        </div>

        <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <AlertDialogContent className="modern-alert-dialog-content">
            <AlertDialogHeader>
              <AlertDialogTitle className="modern-alert-dialog-title">Application Submitted!</AlertDialogTitle>
              <AlertDialogDescription className="modern-alert-dialog-description">
                <div className="flex justify-center my-5">
                  <div className="modern-alert-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-base">
                  Your NGO registration has been submitted successfully. Our team will review your application and verification documents.
                </p>
                <p className="mt-3 text-sm">
                  You will receive an email notification once your application is approved.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-center mt-5">
              <Link to="/login">
                <button className="modern-button modern-alert-button">Return to Login</button>
              </Link>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      <MobileBottomNav />
      <Footer />
      <style>{`
        /* General Page Animations */
        .animate-fade-in { animation: fadeInAnimation 0.7s ease-out forwards; }
        .animate-slide-up { animation: slideUpAnimation 0.6s ease-out forwards; animation-delay: 0.1s; }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpAnimation { from { transform: translateY(30px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

        /* NGO Register Card Styling */
        .modern-glass-ngo-register-card {
          background: rgba(28, 35, 49, 0.85); 
          border-radius: 1.75rem; /* 28px */
          border: 1.5px solid rgba(107, 142, 35, 0.3); 
          box-shadow: 0 12px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
          backdrop-filter: blur(20px) saturate(1.9);
          color: #e4eaf1; 
        }
        .modern-card-header {
          border-color: rgba(107, 142, 35, 0.25) !important;
        }
        .modern-title {
          font-size: 1.9rem; /* 30px */
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 7px rgba(107,142,35,0.4);
          line-height: 1.3;
        }
        .modern-subtitle {
          font-size: 0.95rem; /* 15px */
          color: #bac6d6; 
          margin-top: 0.45rem;
        }

        /* Form Element Styling */
        .modern-label {
          font-size: 0.875rem; /* 14px */
          font-weight: 500;
          color: #cdd6e0;
          display: block;
          margin-bottom: 0.4rem;
        }
        .modern-input-icon {
          color: #8090a0; 
          transition: color 0.2s ease;
        }
        .modern-input, .modern-textarea {
          width: 100%;
          padding: 0.85rem 0.9rem;
          background-color: rgba(10, 18, 28, 0.8); 
          border: 1.5px solid rgba(107, 142, 35, 0.35);
          border-radius: 0.75rem; /* 12px */
          color: #e4eaf1;
          font-size: 0.95rem; 
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .modern-input {
          padding-left: 2.85rem; /* For icon */
        }
        .modern-textarea {
          padding: 0.85rem 0.9rem; /* Consistent padding */
          resize: vertical;
          min-height: 70px;
        }
        .modern-input::placeholder, .modern-textarea::placeholder {
          color: #788898; 
          opacity: 0.8;
        }
        .modern-input:focus, .modern-textarea:focus {
          background-color: rgba(15, 23, 35, 0.9);
          border-color: #82A83A; /* Slightly brighter green for focus */
          box-shadow: 0 0 0 3.5px rgba(107, 142, 35, 0.28);
        }
        .modern-input:focus ~ .modern-input-icon, 
        .modern-input:not(:placeholder-shown) ~ .modern-input-icon,
        .modern-textarea:focus ~ .modern-input-icon, 
        .modern-textarea:not(:placeholder-shown) ~ .modern-input-icon {
            color: #A0C068; /* Brighter icon color */
        }
        .modern-input:hover, .modern-textarea:hover {
           border-color: rgba(107, 142, 35, 0.55);
        }
        .modern-input ~ button .modern-input-icon {
            color: #8090a0;
        }
        .modern-input:focus ~ button .modern-input-icon,
        .modern-input:not(:placeholder-shown) ~ button .modern-input-icon {
            color: #A0C068;
        }
        .modern-input ~ button:hover .modern-input-icon {
             color: #b0d078;
        }
        
        /* File Input Specific Styling */
        .modern-file-input-label {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.85rem 0.9rem;
          background-color: rgba(10, 18, 28, 0.8);
          border: 1.5px dashed rgba(107, 142, 35, 0.45); /* Dashed border for dropzone feel */
          border-radius: 0.75rem;
          color: #bac6d6; /* Lighter text for placeholder */
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .modern-file-input-label:hover {
          background-color: rgba(15, 23, 35, 0.85);
          border-color: rgba(107, 142, 35, 0.65);
        }
        .modern-file-input-label .modern-input-icon {
            color: #8090a0; /* Match other icons */
        }
        .modern-input-hint {
          font-size: 0.75rem; color: #90a0b0; margin-top: 0.25rem; padding-left: 0.2rem;
        }

        .modern-error-text {
          font-size: 0.8rem; 
          color: #ff9a9a; 
          font-weight: 500;
          padding-left: 0.2rem;
          margin-top: 0.25rem;
        }

        /* Button Styling */
        .modern-button {
          width: 100%;
          padding: 0.9rem 1rem; 
          background: linear-gradient(135deg, #769a2f 0%, #5e7a2f 100%); /* Slightly deeper green */
          color: white !important;
          font-weight: 600;
          font-size: 1.05rem;
          border-radius: 0.75rem; 
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 6px 22px rgba(107,142,35,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin-top: 1.5rem; 
        }
        .modern-button:hover:not(:disabled) {
          transform: translateY(-2.5px);
          box-shadow: 0 9px 30px rgba(107,142,35,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset;
          background: linear-gradient(135deg, #82a83a 0%, #6b8e23 100%);
        }
        .modern-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .modern-button svg {
          vertical-align: middle;
        }

        /* Footer Link Styling */
        .modern-card-footer {
          border-color: rgba(107, 142, 35, 0.2) !important;
          background-color: rgba(10, 18, 28, 0.4);
          border-bottom-left-radius: 1.75rem;
          border-bottom-right-radius: 1.75rem;
        }
        .modern-footer-text {
          font-size: 0.9rem;
          color: #bac6d6;
        }
        .modern-link {
          font-weight: 600;
          color: #A0C068; 
          transition: color 0.2s ease, text-shadow 0.2s ease;
        }
        .modern-link:hover {
          color: #b0d078; 
          text-decoration: underline;
          text-shadow: 0 0 10px rgba(176, 208, 120, 0.4);
        }

        /* Alert Dialog Styling */
        .modern-alert-dialog-content {
          background: rgba(30, 38, 52, 0.95) !important; 
          backdrop-filter: blur(15px) saturate(1.8);
          border-radius: 1.25rem !important; /* 20px */
          border: 1.5px solid rgba(107, 142, 35, 0.4) !important;
          box-shadow: 0 10px 50px rgba(0,0,0,0.5) !important;
          color: #e4eaf1 !important;
          max-width: 28rem; /* 448px */
          padding: 2rem !important; /* 32px */
        }
        .modern-alert-dialog-title {
          color: #ffffff !important;
          font-size: 1.6rem !important; /* 25.6px */
          font-weight: 700 !important;
          text-align: center;
          text-shadow: 0 1px 5px rgba(107,142,35,0.3);
        }
        .modern-alert-dialog-description {
          color: #c0c8d4 !important;
          font-size: 0.95rem !important;
          text-align: center;
          line-height: 1.6;
        }
        .modern-alert-icon-wrapper {
          background-color: rgba(107, 142, 35, 0.15);
          border-radius: 50%;
          padding: 0.8rem; /* 13px */
          display: inline-flex; /* To center the icon properly */
          border: 2px solid rgba(107, 142, 35, 0.3);
        }
        .modern-alert-button {
            padding: 0.75rem 1.75rem;
            font-size: 0.95rem;
            margin-top: 0.5rem; /* Reduced margin from button itself */
            background: linear-gradient(135deg, #82a83a 0%, #6b8e23 100%);
            box-shadow: 0 5px 18px rgba(107,142,35,0.3);
        }
        .modern-alert-button:hover {
            background: linear-gradient(135deg, #90c048 0%, #769a2f 100%);
            box-shadow: 0 7px 25px rgba(107,142,35,0.4);
        }

      `}</style>
    </div>
  );
};

export default NGORegister;