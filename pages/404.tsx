import React from 'react';
import Link from 'next/link';

const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">404</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-4">
          <Link href="/" className="btn-primary inline-block">
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Looking for a specific profile?</p>
            <Link href="/register" className="text-blue-400 hover:text-blue-300">
              Register your ENS subdomain
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
      </div>
    </div>
  );
};

export default Custom404;
