import React from 'react';
import Link from 'next/link';

const Custom500: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">500</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Server Error</h1>
        
        <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
          Something went wrong on our end. Please try again later.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
          
          <div>
            <Link href="/" className="btn-secondary">
              Go Home
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
      </div>
    </div>
  );
};

export default Custom500;
