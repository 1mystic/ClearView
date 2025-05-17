import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
          DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Separator } from '../components/ui/separator';
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNewNGOInvites, getNGObyId } from "../utils/services";
import { Badge } from '../components/ui/badge';
import MobileBottomNav from '../components/MobileBottomNav';


function NGOInvite() {
    const navigate = useNavigate();
    const [newInvites, setNewInvites] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const newNGO = async () => {
        try {
            const newNGO = await getNewNGOInvites();
            setNewInvites(newNGO);
            console.log("All invites:", newNGO);
        } 
        catch (error) {
            console.error("Error loading invites:", error);
            toast.error("Failed to load invites");
        } 
        finally {
        setLoading(false);
        }
    };
    
    useEffect(() => {
        newNGO();
    }, []);

    const updateNGOStatus = async (ngoId, newStatus) => {
        const ngoRef = doc(db, "users", ngoId);
    
        try {
            await updateDoc(ngoRef, {
                approvalStatus: newStatus,
            });
            toast.success(`NGO status updated to ${newStatus}`);
            return true;
        } 
        catch (error) {
            toast.error("Error updating NGO status.");
            return null;
        }
    };

    const changeStatus = async (ngoId, newStatus) => {
        const updatedNGO = await updateNGOStatus(ngoId, newStatus);
        if (updatedNGO) {
            newNGO();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'approved':
            return 'bg-blue-100 text-blue-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
        <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
            <svg
                className="animate-spin h-10 w-10 text-[#6B8E23] mx-auto mb-4"
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
            <h2 className="text-xl font-medium">Loading new invites...</h2>
            </div>
        </div>
        );
    }


    return (
        <div className="flex flex-col min-h-screen">
        <NavBar />

        <main className="flex-grow py-6 px-6 md:px-12 bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17] dark relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 dark:bg-black/30 backdrop-blur-2xl z-0 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10 animate-fade-in animate-delay-100">
                <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">NGO Verification</h1>

                <div className="modern-glass-card mb-8 animate-slide-up animate-delay-200">
                    <div className="p-6">
                    <h2 className="modern-card-title mb-2">New NGO Invites</h2>
                    <p className="modern-card-desc">Manage and approve NGOs</p>
                    </div>
                    <Separator className="modern-separator" />
                    <div className="p-6">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Registration Number</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                            <TableHead>View Doc</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {newInvites.length > 0 ? (
                            newInvites.map((ngo) => (
                            <TableRow key={ngo.id}>
                                <TableCell className="font-medium">{ngo.name}</TableCell>
                                <TableCell>{ngo.regNum}</TableCell>
                                <TableCell>{ngo.contactPerson}</TableCell>
                                <TableCell>{ngo.contactNo}</TableCell>
                                <TableCell>
                                    <Badge className={`modern-badge ${ngo.approvalStatus.toLowerCase()}`}>
                                    {ngo.approvalStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="table-action-button change-status-button">
                                            Change Status
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuItem 
                                            onClick={() => changeStatus(ngo.id, 'approved')}
                                            className="cursor-pointer"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => changeStatus(ngo.id, 'rejected')}
                                            className="cursor-pointer"
                                        >
                                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                            Reject
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`${ngo.docProofURL}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="table-action-button view-doc-button">Document</Button>
                                    </Link>
                                </TableCell>
                                
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 modern-table-empty">
                                No new NGO invites found
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            </div>
        </main>

        <MobileBottomNav />
        <Footer />
        <style>{`
          /* General page animations */
          .animate-fade-in { animation: fadeInAnimation 0.7s ease-out forwards; }
          .animate-slide-up { animation: slideUpAnimation 0.6s ease-out forwards; }
          .animate-delay-100 { animation-delay: 100ms; }
          .animate-delay-200 { animation-delay: 200ms; }

          @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUpAnimation { from { transform: translateY(25px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

          /* Modern Glass Card */
          .modern-glass-card {
            background: rgba(30, 35, 46, 0.8); /* Darker base for card */
            border-radius: 1.25rem; /* 20px */
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.3), 0 0 0 1px rgba(107,142,35,0.15);
            border: 1.5px solid rgba(107,142,35,0.25);
            backdrop-filter: blur(12px) saturate(1.5);
            color: #e4e7eb; /* Light gray text */
            transition: box-shadow 0.3s, border 0.3s, transform 0.3s;
          }
          .modern-glass-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 40px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(107,142,35,0.25);
          }
          .modern-card-title {
            color: #ffffff;
            font-size: 1.4rem; /* Slightly larger */
            font-weight: 700;
            text-shadow: 0 1px 5px rgba(107,142,35,0.4);
          }
          .modern-card-desc {
            color: #b0b8c4; /* Softer light gray */
            font-size: 0.95rem;
          }
          .modern-separator {
            background-color: rgba(107,142,35,0.25) !important;
          }

          /* Table Styling */
          /* Make sure these selectors are specific enough */
          .modern-glass-card table { width: 100%; border-collapse: separate; border-spacing: 0; }
          .modern-glass-card th, .modern-glass-card td {
            padding: 0.9rem 1rem; /* Adjusted padding */
            text-align: left;
            border-bottom: 1px solid rgba(107,142,35,0.2);
            color: #c8cdd3; /* Default cell text color */
          }
          .modern-glass-card th {
            background-color: rgba(107,142,35,0.15);
            color: #e4e7eb; /* Header text color */
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .modern-glass-card tr:last-child td { border-bottom: none; }
          .modern-glass-card tbody tr:hover {
            background-color: rgba(107,142,35,0.1);
            transition: background-color 0.2s ease-in-out;
          }
          .modern-glass-card td.font-medium { color: #e4e7eb; font-weight:500; }
          .modern-table-empty { color: #8a919b !important; font-style: italic; }
          
          /* Badge Styling */
          .modern-badge {
            padding: 0.3rem 0.7rem;
            border-radius: 0.75rem; /* 12px */
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            border: 1px solid transparent;
          }
          .modern-badge.pending { background-color: rgba(255, 193, 7, 0.15); color: #ffc107; border-color: rgba(255,193,7,0.3); }
          .modern-badge.approved { background-color: rgba(76, 175, 80, 0.15); color: #4caf50; border-color: rgba(76,175,80,0.3); }
          .modern-badge.rejected { background-color: rgba(244, 67, 54, 0.15); color: #f44336; border-color: rgba(244,67,54,0.3); }

          /* Table Action Buttons */
          .table-action-button {
            background-color: rgba(107,142,35,0.2);
            color: #c8cdd3;
            border: 1px solid rgba(107,142,35,0.4);
            border-radius: 0.4rem; /* 6px */
            padding: 0.4rem 0.9rem;
            font-size: 0.8rem;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
          }
          .table-action-button:hover {
            background-color: rgba(107,142,35,0.4);
            color: #ffffff;
            border-color: rgba(107,142,35,0.6);
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }
          .table-action-button.change-status-button { /* More specific if needed */
            min-width: auto; /* Let it size to content */
          }
          .table-action-button.view-doc-button {
             /* slightly different styling if needed */
          }

          /* Dropdown Menu Content Styling */
          /* Using specific selector to target shadcn/radix dropdown */
          div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menu"] {
            background-color: #2a303c !important; /* Darker slate for menu */
            border: 1px solid rgba(107,142,35,0.4) !important;
            border-radius: 0.6rem !important; /* 10px */
            box-shadow: 0 5px 25px rgba(0,0,0,0.35);
            padding: 0.4rem !important;
          }
          div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menuitem"] {
            color: #c8cdd3 !important;
            border-radius: 0.4rem; /* 6px */
            padding: 0.5rem 0.8rem !important;
            font-size: 0.85rem;
            transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
          }
          div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menuitem"]:hover,
          div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="menuitem\"][data-highlighted] {
            background-color: rgba(107,142,35,0.3) !important;
            color: #ffffff !important;
          }
          div[data-radix-popper-content-wrapper][style*="z-index: 50"] div[role="separator"] {
            background-color: rgba(107,142,35,0.25) !important;
            margin: 0.4rem 0 !important;
          }
          
          /* Ensure icon colors in dropdown are visible */
          div[data-radix-popper-content-wrapper] .lucide-check-circle { color: #4caf50 !important; }
          div[data-radix-popper-content-wrapper] .lucide-x-circle { color: #f44336 !important; }

        `}</style>
        </div>
    )
}

export default NGOInvite
