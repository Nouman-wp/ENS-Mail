import { createPublicClient, http, namehash, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { ENS_CONFIG } from './config';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export class ENSService {
  private client = publicClient;

  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const fullName = `${subdomain}.${ENS_CONFIG.BASE_DOMAIN}`;
      const owner = await this.client.readContract({
        address: ENS_CONFIG.REGISTRY_ADDRESS as `0x${string}`,
        abi: [
          {
            inputs: [{ name: 'node', type: 'bytes32' }],
            name: 'owner',
            outputs: [{ name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'owner',
        args: [namehash(fullName)],
      });
      
      return owner === '0x0000000000000000000000000000000000000000';
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      return false;
    }
  }

  async getENSProfile(address: string): Promise<{
    name?: string;
    avatar?: string;
    displayName?: string;
    inboxPointer?: string;
  }> {
    try {
      // This would typically use ENS resolver to get text records
      // For now, return mock data structure
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
    signer: any
  ): Promise<string> {
    try {
      // This would interact with ENS resolver to set text records
      // Implementation would depend on the specific resolver contract
      const resolverAddress = ENS_CONFIG.RESOLVER_ADDRESS;
      
      const data = encodeFunctionData({
        abi: [
          {
            inputs: [
              { name: 'node', type: 'bytes32' },
              { name: 'key', type: 'string' },
              { name: 'value', type: 'string' },
            ],
            name: 'setText',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'setText',
        args: [namehash(name), key, value],
      });

      // Return transaction hash (mock for now)
      return '0x' + Math.random().toString(16).substr(2, 64);
    } catch (error) {
      console.error('Error setting text record:', error);
      throw error;
    }
  }

  async claimSubdomain(
    subdomain: string,
    ownerAddress: string,
    signer: any
  ): Promise<string> {
    try {
      const fullName = `${subdomain}.${ENS_CONFIG.BASE_DOMAIN}`;
      
      // This would interact with ENS registrar to claim subdomain
      // Implementation depends on the specific registrar contract
      
      // Return transaction hash (mock for now)
      return '0x' + Math.random().toString(16).substr(2, 64);
    } catch (error) {
      console.error('Error claiming subdomain:', error);
      throw error;
    }
  }

  async resolveENSToAddress(ensName: string): Promise<string | null> {
    try {
      // This would resolve ENS name to address
      // For now, return null
      return null;
    } catch (error) {
      console.error('Error resolving ENS to address:', error);
      return null;
    }
  }

  async resolveAddressToENS(address: string): Promise<string | null> {
    try {
      // This would resolve address to ENS name
      // For now, return null
      return null;
    } catch (error) {
      console.error('Error resolving address to ENS:', error);
      return null;
    }
  }
}
