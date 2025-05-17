import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MapPin, Camera, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { db, auth } from "../config/firebase";
import { collection, addDoc, GeoPoint, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { incidentTypes } from "../utils/services";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { serverTimestamp } from "firebase/firestore";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import MobileBottomNav from "../components/MobileBottomNav";

const Report = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const fileInputRef = useRef(null);

  const [relevanceWarningSent, setRelevanceWarningSent] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    type: "",
    description: "",
  });

  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      console.log("Loading MobileNet...");
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      console.log("MobileNet loaded.");
    }
    loadModel();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
            toast.error("Admin users cannot submit reports.");
            navigate("/admin");
          } else {
            setUser({ id: userDoc.id, ...userDoc.data() });
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
        }
      }
      setCheckingRole(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(
            "Unable to get your location. Please enable location services in your browser."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      type: "",
      description: "",
    };

    let isValid = true;

    if (!formData.type) {
      newErrors.type = "Please select a pollution type";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkImageRelevance = async (imageFile) => {
    if (!model || !imageFile) return true;

    try {
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(imageFile);
      await new Promise((resolve) => {
        imgElement.onload = resolve;
      });

      const predictions = await model.classify(imgElement);
      console.log("MobileNet Predictions:", predictions);

      const pollutionKeywords = {
        "Water Discharge": ["water", "river", "lake", "sea", "ocean", "drain", "sewage", "effluent"],
        "Air Emission": ["smoke", "smog", "fumes", "gas", "exhaust", "factory", "chimney", "haze", "fireboat"],
        "Waste Dumping": ["trash", "garbage", "litter", "dump", "pile", "rubbish", "plastic", "cans"],
        "Oil Spill": ["oil", "slick", "petroleum", "crude", "beach", "water"],
        "Chemical Leak": ["chemical", "spill", "leak", "toxic", "hazardous", "liquid", "drum"],
        "Noise Pollution": ["loud", "noise", "sound", "vibration", "traffic", "construction"],
        "Deforestation": ["tree", "cut", "forest", "logging", "bare", "stump"],
        "Illegal Mining": ["mine", "excavation", "digging", "pit", "earth", "dust"],
        "Soil Contamination": ["soil", "ground", "dirt", "polluted", "waste", "chemical"],
        "Other": ["pollution", "environment", "issue", "problem"], 
      };

      const relevantKeywords = pollutionKeywords[formData.type] || [];

      const isRelevant = predictions.some(
        (prediction) =>
          prediction.probability > 0.3 && 
          relevantKeywords.some((keyword) =>
            prediction.className.toLowerCase().includes(keyword)
          )
      );

      return isRelevant;

    } 
    catch (error) {
      console.error("Error checking image relevance:", error);
      return true;
    }
  };

  const handleImageUpload = async () => {
    if (!fileUpload) return;

    const formData = new FormData();
    formData.append("file", fileUpload);
    formData.append("upload_preset", "clear-view-preset");
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Cloudinary response:", data.secure_url, data.url, data);
      toast.success("Image uploaded successfully!");
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!location) {
      toast.error(
        "Location data is required. Please enable location services."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedUrl = "";
      let isRelevant = false; 

      if (fileUpload) {
        isRelevant = await checkImageRelevance(fileUpload, formData.type);
        if (!isRelevant && !relevanceWarningSent) {
          toast.error(
            "The uploaded image might not be relevant to the selected pollution type. Please ensure it provides useful evidence."
          );
          setRelevanceWarningSent(true);
          // Consider giving the user an option to proceed or cancel here
        }
        uploadedUrl = await handleImageUpload();
      }

      const reportLocation = new GeoPoint(
        location.latitude,
        location.longitude
      );

      const reportData = {
        type: formData.type,
        description: formData.description,
        photo_url: uploadedUrl || "",
        location: reportLocation,
        user_id: auth?.currentUser?.uid ?? "anonymous",
        timestamp: serverTimestamp(),
        status: "pending",
        ...(fileUpload && { image_relevance: isRelevant }),
      };

      console.log(reportData);

      await addDoc(collection(db, "reports"), reportData);

      setFormData({ type: "", description: "" });
      setFileUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Report submitted successfully!", {
        description: "Thank you for contributing to our environmental data.",
      });

      // navigate('/')
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingRole) return null;
  if (isAdmin) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-white/90 via-white/80 to-white/90 backdrop-blur-sm border border-green-200/70 rounded-2xl shadow-xl shadow-green-500/10 overflow-hidden">
              <div className="bg-gradient-to-r from-green-100/70 via-[#F2FCE2]/50 to-green-100/40 border-b border-green-300/60 p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-[#4A5C22] flex items-center">
                  <AlertTriangle className="mr-3 h-7 w-7 text-[#6B8E23]" />
                  Submit a Pollution Report
                </h2>
                <p className="text-gray-600 mt-2 text-base">
                  Provide details about the environmental issue you've observed.
                  All reports will be reviewed.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label
                      htmlFor="type"
                      className="font-semibold text-gray-800 block text-sm"
                    >
                      Pollution Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="w-full p-3 bg-gray-50/50 border border-green-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-700"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">Select type of pollution</option>
                      {incidentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-xs font-medium text-red-600 mt-1.5 tracking-wide">
                        {errors.type}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="font-semibold text-gray-800 block text-sm"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe the pollution issue in detail..."
                      className="w-full min-h-[140px] p-3 bg-gray-50/50 border border-green-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {errors.description && (
                      <p className="text-xs font-medium text-red-600 mt-1.5 tracking-wide">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-gray-800 flex items-center block text-sm">
                      <Camera className="mr-2 h-5 w-5 text-green-700" />
                      Photo Evidence (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setFileUpload(e.target.files[0])}
                      className="w-full cursor-pointer border-2 border-dashed border-green-400/70 rounded-xl p-4 text-center text-gray-500 hover:bg-green-50/70 hover:border-green-500 transition-colors duration-300 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                    />

                    {fileUpload && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Preview:</p>
                        <div className="relative w-full h-56 bg-green-50/40 rounded-xl overflow-hidden border-2 border-dashed border-green-300/60 p-2">
                          <img
                            src={URL.createObjectURL(fileUpload)}
                            alt="Selected"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-gray-800 flex items-center block text-sm">
                      <MapPin className="mr-2 h-5 w-5 text-green-700" />
                      Location
                    </label>
                    {location ? (
                      <div className="bg-green-100/60 rounded-xl p-4 border border-green-600/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Your coordinates:
                          </span>
                          <span className="font-mono text-sm bg-white px-3.5 py-1.5 rounded-lg shadow-md border border-green-300/50 text-green-800">
                            {location.latitude.toFixed(6)},{" "}
                            {location.longitude.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    ) : locationError ? (
                      <div className="bg-red-100/80 text-red-800 rounded-xl p-4 border border-red-300/60 flex items-center shadow-sm">
                        <AlertTriangle className="h-5 w-5 mr-2.5 text-red-600" />
                        <span className="text-sm font-medium">
                          {locationError}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-yellow-100/80 text-yellow-800 rounded-xl p-4 border border-yellow-300/60 flex items-center shadow-sm">
                        <svg
                          className="animate-spin h-5 w-5 mr-2.5 text-yellow-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-sm font-medium">
                          Getting your location...
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !location}
                    className="w-full bg-gradient-to-r from-[#6B8E23] to-[#556B2F] hover:from-[#556B2F] hover:to-[#4A5C22] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-[#6B8E23]/40 hover:shadow-xl hover:shadow-[#556B2F]/50 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/80 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 ease-in-out transform active:scale-95 disabled:opacity-60 disabled:transform-none disabled:shadow-lg disabled:from-[#9cb380]/70 disabled:to-[#829169]/70 disabled:hover:from-[#9cb380]/70 disabled:hover:to-[#829169]/70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2.5 h-5 w-5 inline"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting Report...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </form>
              </div>

              <div className="flex flex-col space-y-5 bg-green-50/40 border-t border-green-200/80 p-6 sm:p-8">
                <div className="text-sm text-green-800/90 w-full space-y-2.5">
                  <div className="flex items-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 mr-2.5 text-[#6B8E23] shrink-0"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Your report will be reviewed by our team within 24-48 hours.
                  </div>
                  <div className="flex items-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 mr-2.5 text-[#6B8E23] shrink-0"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V17M12 7V13M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Reports with clear evidence help us take appropriate action
                    faster.
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-green-200/60">
                  <div className="text-sm text-green-700">
                    {user ? (
                      <span className="flex items-center">
                        Reporting as:{" "}
                        <span className="font-semibold ml-1.5 text-[#4A5C22]">
                          {user.name}
                        </span>
                      </span>
                    ) : (
                      <span className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0">
                        <span>Reporting anonymously</span>
                        <a
                          href="/login"
                          className="text-[#6B8E23] hover:text-[#556B2F] hover:underline font-medium transition-colors"
                        >
                          Login to track your reports
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 mb-8 text-center text-sm text-white">
              <p>
                Thank you for helping make our community cleaner and healthier.
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default Report;