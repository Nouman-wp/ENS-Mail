import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-hot-toast';
import { ENSService } from '@/lib/ens';
import { IPFSService } from '@/lib/ipfs';
import { ENS_CONFIG } from '@/lib/config';

const RegisterPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [subdomain, setSubdomain] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const ensService = new ENSService();
  const ipfsService = new IPFSService();

  // Check subdomain availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (!subdomain || subdomain.length < 3) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const available = await ensService.isSubdomainAvailable(subdomain);
        setIsAvailable(available);
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [subdomain]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Avatar file size must be less than 5MB');
        return;
      }
      
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    if (!isConnected || !walletClient || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!subdomain || !isAvailable) {
      toast.error('Please choose an available subdomain');
      return;
    }

    setIsRegistering(true);
    
    try {
      // Upload avatar to IPFS if provided
      let avatarUrl = '';
      if (avatar) {
        toast.loading('Uploading avatar to IPFS...');
        avatarUrl = await ipfsService.uploadAvatar(avatar);
        toast.dismiss();
      }

      // Claim the subdomain
      toast.loading('Claiming subdomain...');
      const claimTx = await ensService.claimSubdomain(subdomain, address, walletClient);
      toast.dismiss();
      toast.success('Subdomain claimed successfully!');

      // Set text records
      if (displayName) {
        toast.loading('Setting display name...');
        await ensService.setTextRecord(
          `${subdomain}.${ENS_CONFIG.BASE_DOMAIN}`,
          'displayName',
          displayName,
          walletClient
        );
        toast.dismiss();
      }

      if (avatarUrl) {
        toast.loading('Setting avatar...');
        await ensService.setTextRecord(
          `${subdomain}.${ENS_CONFIG.BASE_DOMAIN}`,
          'avatar',
          avatarUrl,
          walletClient
        );
        toast.dismiss();
      }

      // Set inbox pointer for XMTP
      toast.loading('Setting up messaging...');
      await ensService.setTextRecord(
        `${subdomain}.${ENS_CONFIG.BASE_DOMAIN}`,
        'inboxPointer',
        address,
        walletClient
      );
      toast.dismiss();

      toast.success('Registration completed! Welcome to ENSMail!');
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const getAvailabilityStatus = () => {
    if (!subdomain || subdomain.length < 3) {
      return { text: 'Enter at least 3 characters', color: 'text-gray-400' };
    }
    if (isChecking) {
      return { text: 'Checking...', color: 'text-yellow-400' };
    }
    if (isAvailable === true) {
      return { text: 'Available!', color: 'text-green-400' };
    }
    if (isAvailable === false) {
      return { text: 'Not available', color: 'text-red-400' };
    }
    return { text: '', color: '' };
  };

  const status = getAvailabilityStatus();

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Register Your <span className="gradient-text">ENS Subdomain</span>
          </h1>
          <p className="text-xl text-gray-400">
            Claim your unique identity on the decentralized web
          </p>
        </div>

        {!isConnected ? (
          <div className="card text-center">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              You need to connect your wallet to register an ENS subdomain
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="card">
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              {/* Subdomain Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Choose Your Subdomain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    placeholder="alice"
                    className="input-field flex-1 rounded-r-none"
                    maxLength={20}
                  />
                  <div className="bg-gray-700 px-4 py-3 rounded-r-lg border border-l-0 border-gray-700 text-gray-300">
                    .{ENS_CONFIG.BASE_DOMAIN}
                  </div>
                </div>
                {status.text && (
                  <p className={`text-sm mt-2 ${status.color}`}>
                    {status.text}
                  </p>
                )}
              </div>

              {/* Display Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alice Smith"
                  className="input-field w-full"
                  maxLength={50}
                />
              </div>

              {/* Avatar Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Avatar (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="btn-secondary cursor-pointer inline-block"
                    >
                      Choose Avatar
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      Max 5MB. Recommended: 400x400px
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Summary */}
              {subdomain && isAvailable && (
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-300 mb-2">Registration Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subdomain:</span>
                      <span className="text-white">{subdomain}.{ENS_CONFIG.BASE_DOMAIN}</span>
                    </div>
                    {displayName && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Display Name:</span>
                        <span className="text-white">{displayName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">Sepolia Testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-green-400">Free (Testnet)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={!subdomain || !isAvailable || isRegistering}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? 'Registering...' : 'Register Subdomain'}
              </button>
            </form>

            {/* Info */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-semibold text-gray-300 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Your subdomain will be registered on Sepolia testnet</li>
                <li>• Your profile information will be stored in ENS text records</li>
                <li>• Your avatar will be uploaded to IPFS for decentralized storage</li>
                <li>• You'll be able to receive messages at your new ENS address</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
