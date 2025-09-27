import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
// import { infuraProvider } from 'wagmi/providers/infura';
import { WALLET_CONNECT_PROJECT_ID, SUPPORTED_CHAINS } from './config';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  SUPPORTED_CHAINS,
  [
    // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || 'demo' }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'ENSMail',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
