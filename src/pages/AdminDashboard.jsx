import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAllReports, getReportsByStatus } from "../utils/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
          DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { MoreHorizontal, Eye, CheckCircle, XCircle, Archive } from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import ReportDetailDialog from '../components/ReportDetailDialog';
import MobileBottomNav from '../components/MobileBottomNav';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingReports, setPendingReports] = useState([]);
  const [verifiedReports, setVerifiedReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Please log in to access the admin dashboard.");
        return navigate("/login");
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data()?.role !== "admin") {
          toast.error("Access denied. Admins only.");
          return navigate("/login");
        }
      } 
      catch (err) {
        console.error("Error checking user role:", err);
        toast.error("An error occurred while checking access.");
        return navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadReports = async () => {
    try {
      const [pending, verified, resolved] = await Promise.all([
        getReportsByStatus('pending'),
        getReportsByStatus('approved'),
        getReportsByStatus('resolved')
      ]);

      setPendingReports(pending);
      setVerifiedReports(verified);
      setResolvedReports(resolved);
    } 
    catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load reports");
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    const reportRef = doc(db, "reports", reportId);
  
    try {
      await updateDoc(reportRef, {
        status: newStatus,
      });

      toast.success(`Report status updated to ${newStatus}`);
      loadReports(); // Reload all reports after status update
      return true;
    } 
    catch (error) {
      console.error("Error updating report status:", error);
      toast.error("Error updating report status.");
      return null;
    }
  };

  const ReportTable = ({ reports, title, onStatusChange }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>View Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.type}</TableCell>
                    <TableCell>
                      {report.location.latitude.toFixed(4)}°{report.location.latitude > 0 ? 'N' : 'S'}, 
                      {report.location.longitude.toFixed(4)}°{report.location.longitude > 0 ? 'E' : 'W'}
                    </TableCell>
                    <TableCell>{report.user_id}</TableCell>
                    <TableCell>{new Date(report.timestamp.seconds * 1000).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button >
                            Change Status
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {report.status === 'pending' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => onStatusChange(report.id, 'approved')}
                                className="cursor-pointer"
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onStatusChange(report.id, 'rejected')}
                                className="cursor-pointer"
                              >
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {report.status === 'approved' && (
                            <DropdownMenuItem 
                              onClick={() => onStatusChange(report.id, 'resolved')}
                              className="cursor-pointer"
                            >
                              <Archive className="mr-2 h-4 w-4 text-green-600" />
                              Mark as Resolved
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>                     
                      <ReportDetailDialog report={report} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No reports found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-6 px-6 md:px-12 bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17] dark relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 dark:bg-black/30 backdrop-blur-2xl z-0 pointer-events-none" />
        <div className="container mx-auto px-4 py-8 relative z-10 animate-fade-in animate-delay-100">
          <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Admin Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="modern-glass-card animate-slide-up animate-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="modern-card-title">Total Reports</CardTitle>
                <CardDescription className="modern-card-desc">All submitted reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="modern-stat-value">
                  {pendingReports.length + verifiedReports.length + resolvedReports.length}
                </p>
              </CardContent>
            </Card>
            
            <Card className="modern-glass-card animate-slide-up animate-delay-300">
              <CardHeader className="pb-2">
                <CardTitle className="modern-card-title">Pending</CardTitle>
                <CardDescription className="modern-card-desc">Reports under review</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="modern-stat-value">{pendingReports.length}</p>
              </CardContent>
            </Card>
            
            <Card className="modern-glass-card animate-slide-up animate-delay-400">
              <CardHeader className="pb-2">
                <CardTitle className="modern-card-title">Verified</CardTitle>
                <CardDescription className="modern-card-desc">Approved reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="modern-stat-value">{verifiedReports.length}</p>
              </CardContent>
            </Card>
            
            <Card className="modern-glass-card animate-slide-up animate-delay-500">
              <CardHeader className="pb-2">
                <CardTitle className="modern-card-title">Resolved</CardTitle>
                <CardDescription className="modern-card-desc">Addressed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="modern-stat-value">{resolvedReports.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <ReportTable 
              reports={pendingReports} 
              title="Pending Reports" 
              onStatusChange={updateReportStatus}
            />
            
            <ReportTable 
              reports={verifiedReports} 
              title="Verified Reports" 
              onStatusChange={updateReportStatus}
            />
            
            <ReportTable 
              reports={resolvedReports} 
              title="Resolved Reports" 
              onStatusChange={updateReportStatus}
            />
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
          transition: all 0.4s ease;
        }
        .modern-glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 50px 0 rgba(0,0,0,0.3), 0 0 0 2px rgba(107,142,35,0.2);
          border-color: rgba(107,142,35,0.3);
        }
        .modern-card-title {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 12px #6B8E23;
        }
        .modern-card-desc {
          color: #e6e6e6;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .modern-stat-value {
          color: #fff;
          font-size: 2.5rem;
          font-weight: 700;
          text-shadow: 0 2px 12px rgba(107,142,35,0.3);
        }
        .modern-table {
          background: rgba(36, 41, 54, 0.85);
          border-radius: 1rem;
          overflow: hidden;
          border: 2px solid rgba(107,142,35,0.18);
        }
        .modern-table th {
          background: rgba(107,142,35,0.1);
          color: #f3f6fa !important;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
        }
        .modern-table td {
          color: #e6e6e6 !important;
          padding: 1rem;
          border-bottom: 1px solid rgba(107,142,35,0.1);
        }
        .modern-table tr:hover {
          background: rgba(107,142,35,0.05);
        }
        table, th, td {
          color: #f3f6fa !important;
        }
        .modern-button {
          background: linear-gradient(135deg, #6B8E23 0%, #556B2F 100%);
          color: white;
          font-weight: 600;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 15px rgba(107,142,35,0.3);
        }
        .modern-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107,142,35,0.4);
          border-color: rgba(255,255,255,0.2);
        }
        .modern-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .modern-badge.pending {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        .modern-badge.approved {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        .modern-badge.resolved {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
        }
        .modern-badge.rejected {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        .animate-delay-100 { animation-delay: 100ms; }
        .animate-delay-200 { animation-delay: 200ms; }
        .animate-delay-300 { animation-delay: 300ms; }
        .animate-delay-400 { animation-delay: 400ms; }
        .animate-delay-500 { animation-delay: 500ms; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        /* Style for ReportTable titles (h2) */
        .space-y-8 > div > h2 {
            color: #f3f6fa !important; /* Light color for table titles */
            text-shadow: 0 1px 8px rgba(107,142,35,0.3);
        }
        

        /* === Styles for Buttons within Report Tables === */
        /* This targets buttons inside the Card that contains each table */
        div.space-y-8 > div.mb-8 table tbody tr td button {
            background-color: rgba(107,142,35,0.25);
            color: #e0e0e0;
            border: 1px solid rgba(107,142,35,0.5);
            border-radius: 0.5rem;
            padding: 0.4rem 0.8rem;
            transition: all 0.2s ease-in-out;
            font-weight: 500;
            line-height: 1.4;
            text-align: center;
        }

        div.space-y-8 > div.mb-8 table tbody tr td button:hover {
            background-color: #6B8E23;
            color: #ffffff;
            border-color: #556B2F;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(107,142,35,0.3);
        }

        /* Specific overrides for "Change Status" button (variant="ghost", size="icon") */
        div.space-y-8 > div.mb-8 table tbody tr td button[variant="ghost"][size="icon"] {
            background-color: rgba(107,142,35,0.15);
            border: 1px solid rgba(107,142,35,0.4);
            padding: 0.5rem 1rem; 
            min-width : 2rem;
        }

        div.space-y-8 > div.mb-8 table tbody tr td button[variant="ghost"][size="icon"]:hover {
            background-color: #556B2F; /* Darker green on hover */
            border-color: #4a5d23;
        }


        /* === Dropdown Menu (Change Status Modal) Styling === */
        /* Targeting Radix UI popover content wrapper, common for shadcn dialogs/menus */
        div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menu"] {
            background-color: #232733 !important; /* Darker, slightly blueish slate */
            border: 1px solid rgba(107,142,35,0.55) !important;
            border-radius: 0.5rem !important; /* 8px */
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            padding: 0.3rem !important; /* More compact */
        }

        div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menuitem"] {
            color: #bcc0c4 !important; /* Lighter gray for readability */
            border-radius: 0.3rem; /* 5px, slightly rounded items */
            padding: 0.45rem 0.75rem !important; /* Compact item padding */
            font-weight: 400; /* Normal weight */
            transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
        }

        div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menuitem"]:hover,
        div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menuitem"][data-highlighted] { /* data-highlighted for keyboard focus */
            background-color: rgba(107,142,35,0.4) !important; /* Accent hover */
            color: #ffffff !important; /* White text on hover */
        }

        div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="separator"] {
            background-color: rgba(107,142,35,0.35) !important;
            margin: 0.3rem 0 !important; /* Compact separator margin */
            height: 1px !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
