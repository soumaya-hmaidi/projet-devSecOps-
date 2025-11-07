'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Key, Zap } from 'lucide-react';
import { useDevFormFiller } from '@/contexts/DevFormFillerContext';

interface DevFormFillerProps {
  onFillAdmin?: (credentials: { email: string; password: string }) => void;
  onFillStudent?: (credentials: { email: string; password: string }) => void;
}

export function DevFormFiller({ onFillAdmin, onFillStudent }: DevFormFillerProps) {
  const { fillAdminCredentials, fillStudentCredentials } = useDevFormFiller();
  
  // Don't show in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleFillAdmin = () => {
    console.log('Filling admin credentials...');
    const credentials = {
      email: 'admin@quiz.com',
      password: 'admin123'
    };
    
    fillAdminCredentials();
    onFillAdmin?.(credentials);
  };

  const handleFillStudent = () => {
    console.log('Filling student credentials...');
    const credentials = {
      email: 'student@quiz.com',
      password: 'student123'
    };
    
    fillStudentCredentials();
    onFillStudent?.(credentials);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-blue-50 border-blue-200 shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-sm text-blue-800">Dev Form Filler</CardTitle>
          <Badge variant="secondary" className="text-xs">DEV</Badge>
        </div>
        <CardDescription className="text-xs text-blue-700">
          Auto-fill login forms for testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Button
            onClick={handleFillAdmin}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Fill Admin Credentials
          </Button>
          <Button
            onClick={handleFillStudent}
            size="sm"
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <User className="h-4 w-4 mr-2" />
            Fill Student Credentials
          </Button>
        </div>
        
        <div className="text-xs text-blue-600 space-y-1">
          <div className="flex items-center space-x-1">
            <Key className="h-3 w-3" />
            <span>Admin: admin@quiz.com / admin123</span>
          </div>
          <div className="flex items-center space-x-1">
            <Key className="h-3 w-3" />
            <span>Student: student@quiz.com / student123</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
