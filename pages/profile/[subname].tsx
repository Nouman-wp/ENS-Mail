import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { toast } from 'react-hot-toast';
import { ENSService } from '@/lib/ens';
import { IPFSService } from '@/lib/ipfs';
import { ENSProfile } from '@/types';
import { ENS_CONFIG } from '@/lib/config';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { subname } = router.query;
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [profile, setProfile] = useState<ENSProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');

  const ensService = new ENSService();
  const ipfsService = new IPFSService();

  useEffect(() => {
    const loadProfile = async () => {
      if (!subname) return;

      setIsLoading(true);
      try {
        let profileAddress = '';
        let ensName = '';

        // Check if subname is an address or ENS name
        if (typeof subname === 'string' && subname.startsWith('0x')) {
          profileAddress = subname;
          const resolvedENS = await ensService.resolveAddressToENS(subname);
          ensName = resolvedENS || '';
        } else {
          ensName = subname as string;
          const resolvedAddress = await ensService.resolveENSToAddress(ensName);
          profileAddress = resolvedAddress || '';
        }

        if (!profileAddress) {
          toast.error('Profile not found');
          router.push('/');
          return;
        }

        // Load ENS profile data
        const ensProfile = await ensService.getENSProfile(profileAddress);
        
        const profileData: ENSProfile = {
          subname: ensName,
          displayName: ensProfile.displayName,
          avatar: ensProfile.avatar,
          inboxPointer: ensProfile.inboxPointer,
          address: profileAddress,
        };

        setProfile(profileData);
        setIsOwner(address?.toLowerCase() === profileAddress.toLowerCase());

        // Set form values
        setDisplayName(ensProfile.displayName || '');
        setAvatarPreview(ensProfile.avatar || '');
        // You'd load additional metadata from IPFS or ENS text records
        setBio('');
        setWebsite('');
        setTwitter('');

      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [subname, address, ensService, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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

  const handleSave = async () => {
    if (!isConnected || !walletClient || !profile) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!isOwner) {
      toast.error('You can only edit your own profile');
      return;
    }

    setIsSaving(true);
    
    try {
      let avatarUrl = profile.avatar;

      // Upload new avatar if provided
      if (avatar) {
        toast.loading('Uploading avatar to IPFS...');
        avatarUrl = await ipfsService.uploadAvatar(avatar);
        toast.dismiss();
      }

      // Update ENS text records
      const fullName = profile.subname || `${profile.address}.addr.reverse`;

      if (displayName !== profile.displayName) {
        toast.loading('Updating display name...');
        await ensService.setTextRecord(fullName, 'displayName', displayName, walletClient);
        toast.dismiss();
      }

      if (avatarUrl !== profile.avatar) {
        toast.loading('Updating avatar...');
        await ensService.setTextRecord(fullName, 'avatar', avatarUrl || '', walletClient);
        toast.dismiss();
      }

      // Update additional metadata
      if (bio) {
        await ensService.setTextRecord(fullName, 'description', bio, walletClient);
      }

      if (website) {
        await ensService.setTextRecord(fullName, 'url', website, walletClient);
      }

      if (twitter) {
        await ensService.setTextRecord(fullName, 'com.twitter', twitter, walletClient);
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        displayName,
        avatar: avatarUrl,
      } : null);

      setIsEditing(false);
      toast.success('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return null;
    
    if (avatar.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${avatar.slice(7)}`;
    }
    
    if (avatar.startsWith('http')) {
      return avatar;
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">The requested profile could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(isEditing ? avatarPreview : profile.avatar);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="text-center">
                {/* Avatar */}
                <div className="mb-6">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile avatar"
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-600"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold text-4xl">
                        {profile.displayName?.[0]?.toUpperCase() || 
                         profile.subname?.[0]?.toUpperCase() || 
                         profile.address.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name and ENS */}
                <h1 className="text-2xl font-bold mb-2">
                  {profile.displayName || 'Anonymous User'}
                </h1>
                
                {profile.subname && (
                  <p className="text-blue-400 font-medium mb-2">
                    {profile.subname}
                  </p>
                )}

                <p className="text-gray-400 text-sm mb-6 font-mono">
                  {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
                </p>

                {/* Actions */}
                {isOwner && (
                  <div className="space-y-3">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary w-full"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="btn-primary w-full disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setDisplayName(profile.displayName || '');
                            setAvatarPreview(profile.avatar || '');
                            setAvatar(null);
                          }}
                          className="btn-secondary w-full"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* External Links */}
                <div className="mt-6 pt-6 border-t border-gray-700">
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
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              /* Edit Form */
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
                
                <div className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      className="input-field w-full"
                      maxLength={50}
                    />
                  </div>

                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Avatar
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
                          Choose New Avatar
                        </label>
                        <p className="text-sm text-gray-400 mt-1">
                          Max 5MB. Recommended: 400x400px
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="input-field w-full h-24 resize-none"
                      maxLength={200}
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="input-field w-full"
                    />
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitter
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-700 px-3 py-3 rounded-l-lg border border-r-0 border-gray-700 text-gray-300">
                        @
                      </span>
                      <input
                        type="text"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value.replace('@', ''))}
                        placeholder="username"
                        className="input-field flex-1 rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Profile Display */
              <div className="space-y-6">
                {/* Stats */}
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Stats</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">0</div>
                      <div className="text-sm text-gray-400">Messages Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">0</div>
                      <div className="text-sm text-gray-400">Messages Received</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">0</div>
                      <div className="text-sm text-gray-400">Conversations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {profile.subname ? '1' : '0'}
                      </div>
                      <div className="text-sm text-gray-400">ENS Names</div>
                    </div>
                  </div>
                </div>

                {/* About */}
                {bio && (
                  <div className="card">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-300 leading-relaxed">{bio}</p>
                  </div>
                )}

                {/* Links */}
                {(website || twitter) && (
                  <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Links</h2>
                    <div className="space-y-3">
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          <span>{website}</span>
                        </a>
                      )}
                      {twitter && (
                        <a
                          href={`https://twitter.com/${twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span>@{twitter}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ENS Records */}
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">ENS Information</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Address:</span>
                      <span className="font-mono text-sm">{profile.address}</span>
                    </div>
                    {profile.subname && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">ENS Name:</span>
                        <span className="text-blue-400">{profile.subname}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Network:</span>
                      <span>Sepolia Testnet</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
