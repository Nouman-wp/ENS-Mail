import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { APP_CONFIG } from '@/lib/config';

const HomePage: React.FC = () => {
  const { isConnected } = useAccount();

  const features = [
    {
      icon: '🔐',
      title: 'Wallet-to-Wallet Messaging',
      description: 'Send encrypted messages directly between Ethereum wallets using XMTP protocol.',
    },
    {
      icon: '🌐',
      title: 'ENS Subdomain Identity',
      description: 'Claim your unique subdomain like alice.mail.eth for decentralized identity.',
    },
    {
      icon: '📱',
      title: 'Decentralized Hosting',
      description: 'Your profile and messages are hosted on IPFS and accessible via .eth.limo pages.',
    },
    {
      icon: '🔒',
      title: 'End-to-End Encryption',
      description: 'All messages are encrypted client-side before being sent through the network.',
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Receive messages instantly with real-time synchronization across devices.',
    },
    {
      icon: '🎨',
      title: 'Customizable Profiles',
      description: 'Set your avatar, display name, and other metadata stored on ENS.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
              <span className="gradient-text">ENSMail</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Decentralized Messaging via ENS Subnames
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Send encrypted messages wallet-to-wallet, claim your unique ENS subdomain, 
              and communicate on the decentralized web with complete privacy and ownership.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isConnected ? (
                <>
                  <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                    Go to Dashboard
                  </Link>
                  <Link href="/register" className="btn-secondary text-lg px-8 py-4">
                    Register Subdomain
                  </Link>
                </>
              ) : (
                <>
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        onClick={openConnectModal}
                        className="btn-primary text-lg px-8 py-4"
                      >
                        Connect Wallet to Start
                      </button>
                    )}
                  </ConnectButton.Custom>
                  <Link href="/register" className="btn-secondary text-lg px-8 py-4">
                    Learn More
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                <div className="text-gray-400">Decentralized</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">E2E</div>
                <div className="text-gray-400">Encrypted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">Web3</div>
                <div className="text-gray-400">Native</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">ENSMail</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built on Ethereum, powered by ENS, secured by XMTP, and hosted on IPFS. 
              The future of decentralized communication is here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:border-blue-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started with decentralized messaging in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Your Wallet</h3>
              <p className="text-gray-400">
                Connect your MetaMask or any Web3 wallet to get started with ENSMail.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Claim Your Subdomain</h3>
              <p className="text-gray-400">
                Register your unique subdomain like alice.mail.eth on Sepolia testnet.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Messaging</h3>
              <p className="text-gray-400">
                Send encrypted messages to other ENS users and build your Web3 network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join the Decentralized Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start messaging on the decentralized web today. No servers, no surveillance, 
            just pure peer-to-peer communication.
          </p>
          
          {isConnected ? (
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Register Your Subdomain
            </Link>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Connect Wallet to Get Started
                </button>
              )}
            </ConnectButton.Custom>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
