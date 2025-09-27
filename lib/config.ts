import { sepolia } from 'wagmi/chains';

export const CHAIN_CONFIG = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Sepolia Ether',
      symbol: 'SEP',
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
      },
      public: {
        http: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  },
};

export const ENS_CONFIG = {
  REGISTRY_ADDRESS: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  RESOLVER_ADDRESS: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
  BASE_DOMAIN: 'mail.eth',
  SEPOLIA_CHAIN_ID: 11155111,
};

export const XMTP_CONFIG = {
  ENV: 'production' as const,
  ENCRYPTION_KEY: 'ensmail-xmtp-key',
};

export const IPFS_CONFIG = {
  GATEWAY_URL: 'https://ipfs.io/ipfs/',
  PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
  API_URL: 'https://api.web3.storage/upload', // Using web3.storage instead
};

export const APP_CONFIG = {
  NAME: 'ENSMail',
  DESCRIPTION: 'Decentralized Messaging via ENS Subnames',
  URL: 'https://ensmail.eth.limo',
  LOGO: '/logo.svg',
  FAVICON: '/favicon.ico',
};

export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id';

export const SUPPORTED_CHAINS = [sepolia];

export const DEFAULT_CHAIN = sepolia;
