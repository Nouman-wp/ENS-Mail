import { createPublicClient, http, namehash, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { ENS_CONFIG } from './config';

// Contract ABI for our subdomain registrar
const SUBDOMAIN_REGISTRAR_ABI = [
  {
    inputs: [{ name: 'label', type: 'string' }],
    name: 'isSubdomainAvailable',
    outputs: [{ name: 'available', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'label', type: 'string' },
      { name: 'owner', type: 'address' },
    ],
    name: 'registerSubdomain',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'label', type: 'string' },
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Deployed contract address (you'll need to update this after deployment)
const SUBDOMAIN_REGISTRAR_ADDRESS = '0x0000000000000000000000000000000000000000'; // Update after deployment

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export class ENSService {
  private client = publicClient;

  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      // Check if contract is deployed
      if (SUBDOMAIN_REGISTRAR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        console.warn('Subdomain registrar not deployed yet, returning true for demo');
        return true;
      }

      const available = await this.client.readContract({
        address: SUBDOMAIN_REGISTRAR_ADDRESS as `0x${string}`,
        abi: SUBDOMAIN_REGISTRAR_ABI,
        functionName: 'isSubdomainAvailable',
        args: [subdomain],
      });
      
      return available;
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      return true; // Return true for demo purposes
    }
  }

  async getENSProfile(address: string): Promise<{
    name?: string;
    avatar?: string;
    displayName?: string;
    inboxPointer?: string;
  }> {
    try {
      // For now, return empty profile - this would be populated by wagmi hooks in components
      return {
        name: undefined,
        avatar: undefined,
        displayName: undefined,
        inboxPointer: undefined,
      };
    } catch (error) {
      console.error('Error fetching ENS profile:', error);
      return {};
    }
  }

  async setTextRecord(
    name: string,
    key: string,
    value: string,
    walletClient: any
  ): Promise<string> {
    try {
      // Extract subdomain from full name
      const subdomain = name.split('.')[0];
      
      if (SUBDOMAIN_REGISTRAR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        console.warn('Contract not deployed, returning mock transaction hash');
        return '0x' + Math.random().toString(16).substr(2, 64);
      }

      // Use the registrar contract to update profile
      const hash = await walletClient.writeContract({
        address: SUBDOMAIN_REGISTRAR_ADDRESS,
        abi: SUBDOMAIN_REGISTRAR_ABI,
        functionName: 'updateProfile',
        args: [subdomain, key, value],
      });

      return hash;
    } catch (error) {
      console.error('Error setting text record:', error);
      throw error;
    }
  }

  async claimSubdomain(
    subdomain: string,
    ownerAddress: string,
    walletClient: any
  ): Promise<string> {
    try {
      if (SUBDOMAIN_REGISTRAR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        console.warn('Contract not deployed, returning mock transaction hash');
        return '0x' + Math.random().toString(16).substr(2, 64);
      }

      // Use the registrar contract to register subdomain
      const hash = await walletClient.writeContract({
        address: SUBDOMAIN_REGISTRAR_ADDRESS,
        abi: SUBDOMAIN_REGISTRAR_ABI,
        functionName: 'registerSubdomain',
        args: [subdomain, ownerAddress],
      });

      return hash;
    } catch (error) {
      console.error('Error claiming subdomain:', error);
      throw error;
    }
  }

  async resolveENSToAddress(ensName: string): Promise<string | null> {
    try {
      // This will be handled by wagmi hooks in components
      return null;
    } catch (error) {
      console.error('Error resolving ENS to address:', error);
      return null;
    }
  }

  async resolveAddressToENS(address: string): Promise<string | null> {
    try {
      // This will be handled by wagmi hooks in components
      return null;
    } catch (error) {
      console.error('Error resolving address to ENS:', error);
      return null;
    }
  }
}
