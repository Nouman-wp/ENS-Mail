import { create } from 'ipfs-http-client';
import { IPFS_CONFIG } from './config';

export class IPFSService {
  private client: any;

  constructor() {
    // Initialize IPFS client (you'd use your own IPFS node or service)
    this.client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
        ).toString('base64')}`,
      },
    });
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const added = await this.client.add(file);
      return added.path;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      const json = JSON.stringify(data);
      const added = await this.client.add(json);
      return added.path;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  async getFile(hash: string): Promise<Uint8Array> {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }
      return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
    } catch (error) {
      console.error('Error fetching file from IPFS:', error);
      throw error;
    }
  }

  async getJSON(hash: string): Promise<any> {
    try {
      const data = await this.getFile(hash);
      const json = new TextDecoder().decode(data);
      return JSON.parse(json);
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
      await this.client.pin.add(hash);
    } catch (error) {
      console.error('Error pinning file:', error);
      throw error;
    }
  }

  async unpinFile(hash: string): Promise<void> {
    try {
      await this.client.pin.rm(hash);
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
