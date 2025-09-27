import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ENSService } from '@/lib/ens';
import { ENSProfile } from '@/types';

export const useENS = () => {
  const { address } = useAccount();
  const [ensService] = useState(() => new ENSService());
  const [profile, setProfile] = useState<ENSProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!address) {
        setProfile(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const ensProfile = await ensService.getENSProfile(address);
        const ensName = await ensService.resolveAddressToENS(address);
        
        setProfile({
          subname: ensName || '',
          displayName: ensProfile.displayName,
          avatar: ensProfile.avatar,
          inboxPointer: ensProfile.inboxPointer,
          address,
        });
      } catch (err) {
        console.error('Error loading ENS profile:', err);
        setError('Failed to load ENS profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [address, ensService]);

  const resolveENS = async (ensName: string): Promise<string | null> => {
    try {
      return await ensService.resolveENSToAddress(ensName);
    } catch (error) {
      console.error('Error resolving ENS:', error);
      return null;
    }
  };

  const resolveAddress = async (address: string): Promise<string | null> => {
    try {
      return await ensService.resolveAddressToENS(address);
    } catch (error) {
      console.error('Error resolving address:', error);
      return null;
    }
  };

  const checkAvailability = async (subdomain: string): Promise<boolean> => {
    try {
      return await ensService.isSubdomainAvailable(subdomain);
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    resolveENS,
    resolveAddress,
    checkAvailability,
    ensService,
  };
};
