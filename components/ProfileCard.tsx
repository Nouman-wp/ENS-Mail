import React from 'react';
import Link from 'next/link';
import { ENSProfile } from '@/types';

interface ProfileCardProps {
  profile: ENSProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return null;
    
    // Handle IPFS URLs
    if (avatar.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${avatar.slice(7)}`;
    }
    
    // Handle direct URLs
    if (avatar.startsWith('http')) {
      return avatar;
    }
    
    return null;
  };

  const avatarUrl = getAvatarUrl(profile.avatar);

  return (
    <div className="card">
      <div className="text-center">
        {/* Avatar */}
        <div className="mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile avatar"
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-600"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback avatar */}
          <div className={`w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto ${avatarUrl ? 'hidden' : ''}`}>
            <span className="text-white font-bold text-2xl">
              {profile.displayName?.[0]?.toUpperCase() || 
               profile.subname?.[0]?.toUpperCase() || 
               profile.address.slice(2, 4).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Display Name */}
        <h2 className="text-xl font-semibold mb-1">
          {profile.displayName || 'Anonymous User'}
        </h2>

        {/* ENS Name */}
        {profile.subname && (
          <p className="text-blue-400 font-medium mb-2">
            {profile.subname}
          </p>
        )}

        {/* Address */}
        <p className="text-gray-400 text-sm mb-4 font-mono">
          {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-lg font-semibold text-blue-400">0</div>
            <div className="text-xs text-gray-400">Messages</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-lg font-semibold text-blue-400">0</div>
            <div className="text-xs text-gray-400">Contacts</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link
            href={`/profile/${profile.subname || profile.address}`}
            className="btn-secondary w-full text-center block"
          >
            Edit Profile
          </Link>
          
          {profile.subname && (
            <a
              href={`https://${profile.subname}.eth.limo`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>View on .eth.limo</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
