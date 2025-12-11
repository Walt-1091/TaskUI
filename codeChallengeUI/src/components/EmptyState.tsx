import React from 'react';
import { CheckCircle } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks yet</h3>
      <p className="text-gray-500">Create your first task to get started!</p>
    </div>
  );
};