import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import { APP_CONFIG } from '@/lib/config';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = APP_CONFIG.NAME,
  description = APP_CONFIG.DESCRIPTION 
}) => {
  const router = useRouter();
  const isLandingPage = router.pathname === '/';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={APP_CONFIG.FAVICON} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={APP_CONFIG.URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${APP_CONFIG.URL}/og-image.png`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${APP_CONFIG.URL}/og-image.png`} />
        
        {/* PWA */}
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {!isLandingPage && <Navbar />}
        
        <main className={`flex-1 ${!isLandingPage ? 'pt-16' : ''}`}>
          {children}
        </main>
        
        {/* Background gradient overlay */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900 opacity-90" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000" />
        </div>
      </div>
    </>
  );
};

export default Layout;
