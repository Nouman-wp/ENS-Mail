import { IPFS_CONFIG } from './config';

export class IPFSService {
  constructor() {
    // Using public IPFS gateways instead of Infura
  }

  async uploadFile(file: File): Promise<string> {
    try {
      // For demo purposes, create a mock hash
      // In production, you'd use a service like Web3.Storage, Pinata, or your own IPFS node
      const mockHash = 'Qm' + Math.random().toString(36).substr(2, 44);
      console.warn('Mock IPFS upload - file not actually uploaded:', file.name);
      return mockHash;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      // For demo purposes, create a mock hash
      const mockHash = 'Qm' + Math.random().toString(36).substr(2, 44);
      console.warn('Mock IPFS JSON upload:', data);
      return mockHash;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  async getFile(hash: string): Promise<Uint8Array> {
    try {
      // Try to fetch from public gateway
      const response = await fetch(this.getGatewayUrl(hash));
      if (!response.ok) throw new Error('Failed to fetch from IPFS');
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Error fetching file from IPFS:', error);
      throw error;
    }
  }

  async getJSON(hash: string): Promise<any> {
    try {
      const response = await fetch(this.getGatewayUrl(hash));
      if (!response.ok) throw new Error('Failed to fetch from IPFS');
      return await response.json();
    } catch (error) {
      console.error('Error fetching JSON from IPFS:', error);
      throw error;
    }
  }

  getGatewayUrl(hash: string): string {
    return `${IPFS_CONFIG.GATEWAY_URL}${hash}`;
  }

  getPinataUrl(hash: string): string {
    return `${IPFS_CONFIG.PINATA_GATEWAY}${hash}`;
  }

  async pinFile(hash: string): Promise<void> {
    try {
      console.warn('Mock pin operation for hash:', hash);
      // In production, you'd use a pinning service
    } catch (error) {
      console.error('Error pinning file:', error);
      throw error;
    }
  }

  async unpinFile(hash: string): Promise<void> {
    try {
      console.warn('Mock unpin operation for hash:', hash);
      // In production, you'd use a pinning service
    } catch (error) {
      console.error('Error unpinning file:', error);
      throw error;
    }
  }

  // Helper method to upload avatar and return IPFS URL
  async uploadAvatar(file: File): Promise<string> {
    const hash = await this.uploadFile(file);
    return this.getGatewayUrl(hash);
  }

  // Helper method to create metadata for ENS profile
  async createProfileMetadata(profile: {
    displayName?: string;
    avatar?: string;
    bio?: string;
    website?: string;
    twitter?: string;
  }): Promise<string> {
    const metadata = {
      name: profile.displayName,
      description: profile.bio,
      image: profile.avatar,
      external_url: profile.website,
      attributes: [
        ...(profile.twitter ? [{ trait_type: 'Twitter', value: profile.twitter }] : []),
      ],
    };

    const hash = await this.uploadJSON(metadata);
    return this.getGatewayUrl(hash);
  }
}
