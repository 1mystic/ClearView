import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from '../components/ui/button';
import { CheckCircle, Eye, XCircle } from 'lucide-react';

const ChangeStatusSheet = ({ report, open, onOpenChange, onStatusChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="h-8"
        >
          Change Status
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96 bg-white">
        <SheetHeader>
          <SheetTitle>Change Status</SheetTitle>
          <SheetDescription>
            Select an action to update the report status
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-green-600"
            onClick={() => onStatusChange(report.id, 'Verified')}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Mark as Verified
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-yellow-600"
            onClick={() => onStatusChange(report.id, 'Under Review')}
          >
            <Eye className="mr-2 h-4 w-4 text-yellow-600" />
            Set to Under Review
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-blue-600"
            onClick={() => onStatusChange(report.id, 'Resolved')}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
            Mark as Resolved
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600"
            onClick={() => onStatusChange(report.id, 'Rejected')}
          >
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            Mark as Rejected
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChangeStatusSheet; 