import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { WALLET_CONNECT_PROJECT_ID } from './config';

export const wagmiConfig = getDefaultConfig({
  appName: 'ENSMail',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia],
  ssr: true,
});

export const chains = [sepolia];
