import React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ENSProfile } from '@/types';
import ENSProfile as ENSProfileComponent from './ENSProfile';

interface ProfileCardProps {
  profile?: ENSProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { address } = useAccount();

  return (
    <div className="card">
      <div className="text-center">
        {/* ENS Profile Component */}
        <div className="mb-6 flex justify-center">
          <div className="scale-150">
            <ENSProfileComponent 
              address={address}
              showAddress={true}
              className="flex-col items-center text-center"
            />
          </div>
        </div>

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
            href={`/profile/${address}`}
            className="btn-secondary w-full text-center block"
          >
            Edit Profile
          </Link>
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
