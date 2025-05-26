
import React from 'react';
import { Card } from '@/components/ui/card';
import AdminDataViewer from '@/components/AdminDataViewer';
import { Shield } from 'lucide-react';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Survey Administration</h1>
            <p className="text-gray-600">
              View and manage survey responses data
            </p>
          </div>
          
          <AdminDataViewer />
        </Card>
      </div>
    </div>
  );
};

export default Admin;
