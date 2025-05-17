import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { User, Building } from 'lucide-react';
import { Button } from './ui/button';

const RegisterTypeDialog = ({ isOpen, onOpenChange }) => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    onOpenChange(false);
    if (type === 'user') {
      navigate('/register');
    } else {
      navigate('/ngo-register');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Join ClearView</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Choose how you want to contribute to a cleaner environment
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <Button 
            onClick={() => handleUserTypeSelect('user')}
            variant="outline" 
            className="flex flex-col items-center justify-center h-40 p-4 border-2 hover:border-[#6B8E23] hover:bg-[#F2FCE2] transition-all"
          >
            <User className="h-12 w-12 mb-4 text-[#6B8E23]" />
            <div className="text-center">
              <h3 className="font-bold mb-1">Individual</h3>
              {/* <p className="text-sm text-muted-foreground">Report issues and track your environmental impact</p> */}
            </div>
          </Button>
          
          <Button 
            onClick={() => handleUserTypeSelect('ngo')}
            variant="outline" 
            className="flex flex-col items-center justify-center h-40 p-4 border-2 hover:border-[#6B8E23] hover:bg-[#F2FCE2] transition-all"
          >
            <Building className="h-12 w-12 mb-4 text-[#6B8E23]" />
            <div className="text-center">
              <h3 className="font-bold mb-1">Organization/NGO</h3>
              {/* <p className="text-sm text-muted-foreground">Collaborate and lead environmental initiatives</p> */}
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterTypeDialog;