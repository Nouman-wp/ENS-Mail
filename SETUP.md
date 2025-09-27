# ENSMail Setup Guide

## Quick Start (No API Keys Required!)

The app now works without any external API keys! Just follow these steps:

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Create Environment File
Create `.env.local` in your project root:
```env
# Only WalletConnect Project ID is required
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=demo-project-id

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CHAIN_ID=11155111
```

### Step 3: Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the beautiful ENSMail interface!

## Getting a Real WalletConnect Project ID (Optional)

For production use, get a real WalletConnect Project ID:

1. Go to [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Sign up and create a new project
3. Copy your Project ID
4. Replace `demo-project-id` in `.env.local`

## Smart Contract Deployment (For Real ENS Functionality)

To enable actual subdomain registration:

### Step 1: Deploy the Contract
```bash
cd contracts
npm install
```

### Step 2: Configure Deployment
Edit `contracts/hardhat.config.js` and add your private key:
```env
PRIVATE_KEY=your_wallet_private_key_here
```

### Step 3: Deploy to Sepolia
```bash
npm run deploy:sepolia
```

### Step 4: Update Contract Address
Copy the deployed contract address and update `SUBDOMAIN_REGISTRAR_ADDRESS` in `lib/ens.ts`

## Features That Work Now

✅ **Beautiful UI** - Black to gradient blue theme
✅ **Wallet Connection** - MetaMask/WalletConnect integration  
✅ **ENS Resolution** - Real ENS name/avatar lookup using wagmi
✅ **Responsive Design** - Works on desktop and mobile
✅ **Navigation** - All pages and routing work
✅ **XMTP Integration** - Messaging framework ready

## Features That Need Contract Deployment

🔄 **Subdomain Registration** - Works with mock data until contract deployed
🔄 **Profile Updates** - Works with mock transactions until contract deployed

## Getting Sepolia ETH

1. Install MetaMask and switch to Sepolia testnet
2. Get free test ETH from [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
3. You'll need ETH for contract deployment and transactions

## Troubleshooting

**Black page?**
- Check browser console for errors
- Ensure MetaMask is installed
- Try refreshing the page

**Wallet connection issues?**
- Make sure you're on Sepolia testnet
- Try disconnecting and reconnecting wallet
- Check that WalletConnect Project ID is set

**Contract deployment fails?**
- Ensure you have Sepolia ETH
- Check your private key is correct
- Try using a different RPC endpoint
