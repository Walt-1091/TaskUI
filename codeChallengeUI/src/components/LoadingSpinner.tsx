import { Loader2 } from "lucide-react";

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="text-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
    <p className="text-gray-600">{message}</p>
  </div>
);

export default LoadingSpinner;