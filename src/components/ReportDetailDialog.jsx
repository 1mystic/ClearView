import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from '../components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const ReportDetailDialog = ({ report }) => {

    const getStatusColor = (status) => {
        switch (status) {
        // case 'verified':
        //   return 'bg-green-100 text-green-800';
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            View details for this report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium">Type</h3>
            <p>{report.type}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p>{report.description}</p>
          </div>
          <div>
            <h3 className="font-medium">Location</h3>
            <p>{report.location.latitude.toFixed(4)}°{report.location.latitude > 0 ? 'N' : 'S'}, {report.location.longitude.toFixed(4)}°{report.location.longitude > 0 ? 'E' : 'W'}</p>
          </div>
          <div>
            <h3 className="font-medium">Reported On</h3>
            <p>{new Date(report.timestamp.seconds * 1000).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <Badge className={getStatusColor(report.status)}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium">Submitted By</h3>
            <p>{report.user_id}</p>
          </div>
          {report.photo_url && (
            <div>
              <h3 className="font-medium">Images</h3>
              {/* <p>{report.photo_url}</p> */}
              <div className="flex gap-2 mt-2 flex-wrap">
                <img 
                src={report.photo_url} 
                className="h-16 w-16 object-cover rounded-md border" 
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailDialog;