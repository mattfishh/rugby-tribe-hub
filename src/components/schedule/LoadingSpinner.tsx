
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
    </div>
  );
};

export default LoadingSpinner;
