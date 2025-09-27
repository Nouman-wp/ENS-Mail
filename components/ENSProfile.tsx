import React from 'react';
import { useAccount, useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';
import { normalize } from 'viem/ens';

interface ENSProfileProps {
  address?: string;
  ensName?: string;
  showAddress?: boolean;
  className?: string;
}

const ENSProfile: React.FC<ENSProfileProps> = ({ 
  address: propAddress, 
  ensName: propEnsName,
  showAddress = true,
  className = ""
}) => {
  const { address: connectedAddress } = useAccount();
  const targetAddress = propAddress || connectedAddress;

  // Get ENS name from address
  const { data: ensName } = useEnsName({ 
    address: targetAddress as `0x${string}`,
    chainId: 1 // Always use mainnet for ENS resolution
  });

  // Get avatar from ENS name
  const { data: ensAvatar } = useEnsAvatar({ 
    name: propEnsName ? normalize(propEnsName) : ensName ? normalize(ensName) : undefined,
    chainId: 1
  });

  // If we have an ENS name but no address, resolve it
  const { data: resolvedAddress } = useEnsAddress({
    name: propEnsName ? normalize(propEnsName) : undefined,
    chainId: 1
  });

  const displayAddress = targetAddress || resolvedAddress;
  const displayName = propEnsName || ensName;

  if (!displayAddress && !displayName) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Avatar */}
      <div className="relative">
        {ensAvatar ? (
          <img
            src={ensAvatar}
            alt="ENS Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
            onError={(e) => {
              // Fallback to gradient avatar if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback gradient avatar */}
        <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center ${ensAvatar ? 'hidden' : ''}`}>
          <span className="text-white font-semibold text-sm">
            {displayName?.[0]?.toUpperCase() || 
             displayAddress?.slice(2, 4).toUpperCase() || '?'}
          </span>
        </div>
      </div>

      {/* Name and Address */}
      <div className="flex flex-col leading-tight">
        {displayName && (
          <span className="font-semibold text-white">
            {displayName}
          </span>
        )}
        {showAddress && displayAddress && (
          <span className="text-sm text-gray-400 font-mono">
            {displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ENSProfile;
