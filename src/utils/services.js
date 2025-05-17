import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "sonner";

export const getPendingReports = async () => {
  const q = query(collection(db, "reports"), where("status", "==", "pending"));
  const querySnapshot = await getDocs(q);

  const reports = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return reports;
};

export const getNewNGOInvites = async () => {
  const usersRef = collection(db, "users");
  
  const q = query(usersRef, where("approvalStatus", "==", "pending"), where("role", "==", "ngo"));
  const querySnapshot = await getDocs(q);

  const newNGOs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return newNGOs;
};

export const getLeaderboard = async () => {
  const reportsSnapshot = await getDocs(collection(db, "reports"));

  const userReportCount = {};

  reportsSnapshot.forEach((doc) => {
    const report = doc.data();
    if (report.status === "approved" && report.user_id && report.user_id !== "anonymous") {
      if (userReportCount[report.user_id]) {
        userReportCount[report.user_id]++;
      } 
      else {
        userReportCount[report.user_id] = 1;
      }
    }
  });

  console.log(userReportCount,  "user-report count")

  const leaderboard = [];

  for (const userId in userReportCount) {
    console.log(userId)
    
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      console.warn(`User not found in Firestore: ${userId}`);
    }

    leaderboard.push({
      name: userDoc.data().name,
      points: userDoc.data().points,
      count: userReportCount[userId],
      userId,
    });
  }

  leaderboard.sort((a, b) => b.points - a.points);

  console.log("Leaderboard before sending to :", leaderboard);

  return leaderboard;
};

export const getReportsByStatus = async (status) => {
  try {
    const q = query(collection(db, "reports"), where("status", "==", status));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        latitude: data.location?.latitude || 0,
        longitude: data.location?.longitude || 0,
        timestamp: data.timestamp?.toDate?.() || new Date(),
      };
    });
  } catch (error) {
    console.error(`Error fetching ${status} reports:`, error);
    return [];
  }
};

export const getAllReports = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reports"));
    const reports = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        latitude: data.location?.latitude || 0,
        longitude: data.location?.longitude || 0,
        timestamp: data.timestamp?.toDate?.() || new Date(),
      };
    });

    // Filter for approved, auto-approved, or resolved reports
    return reports.filter(report => 
      report.status === 'approved' || 
      report.status === 'resolved' ||
      report.status === 'pending' ||
      report.autoApproved === true
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};


// export const updateReportStatus = async (reportId, newStatus) => {
//   const reportRef = doc(db, "reports", reportId);

//   try {
//     await updateDoc(reportRef, {
//       status: newStatus,
//     });
//     console.log(`Report ${reportId} status updated to ${newStatus}`);
//     toast.success(`Report status updated to ${newStatus}`);
//     return true;
//   } 
//   catch (error) {
//     console.error("Error updating report status:", error);
//     toast.error("Error updating report status.");
//     return null;
//   }
// };


export const incidentTypes = [
  'Water Discharge',
  'Air Emission',
  'Waste Dumping',
  'Oil Spill',
  'Chemical Leak',
  'Noise Pollution',
  'Deforestation',
  'Illegal Mining',
  'Soil Contamination',
  'Other'
];

export const getNGObyId = async (ngoId) => {
  const ngoRef = doc(db, "users", ngoId);
  const ngoSnap = await getDoc(ngoRef);

  if (ngoSnap.exists()) {
    return { id: ngoSnap.id, ...ngoSnap.data() };
  } 
  else {
    console.error("Error fetching NGO details", error);
  }
};

export const getReportById = async (reportId) => {
  const reportRef = doc(db, "reports", reportId);
  const reportSnap = await getDoc(reportRef);

  if (reportSnap.exists()) {
    return { id: reportSnap.id, ...reportSnap.data() };
  } 
  else {
    console.error("Error fetching report details", error);
  }
};

export const getReportsByUser = (userId) => {
  return reports.filter(report => report.userId === userId);
};

export const submitReport = (reportData) => {
  const id = (reports.length + 1).toString();
  const newReport = {
    id,
    ...reportData,
    status: 'Under Review',
    date: new Date().toISOString().slice(0, 10),
  };
  reports.push(newReport);
  return newReport;
};

