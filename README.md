# ENSMail - Decentralized Messaging Platform

ENSMail is a decentralized messaging platform built on Ethereum, using ENS subdomains for identity and XMTP for encrypted wallet-to-wallet messaging. The platform features a beautiful black-to-gradient-blue theme and is designed to be hosted on .eth.limo pages.

## Features

- 🔐 **Wallet-to-Wallet Messaging**: Send encrypted messages directly between Ethereum wallets using XMTP
- 🌐 **ENS Subdomain Identity**: Claim unique subdomains like `alice.mail.eth` for decentralized identity
- 📱 **Decentralized Hosting**: Profiles and messages hosted on IPFS, accessible via .eth.limo pages
- 🔒 **End-to-End Encryption**: All messages encrypted client-side before transmission
- ⚡ **Real-time Updates**: Instant message delivery with real-time synchronization
- 🎨 **Customizable Profiles**: Set avatars, display names, and metadata stored on ENS
- 📱 **Responsive Design**: Beautiful UI that works on desktop and mobile
- 🌙 **Dark Theme**: Elegant black-to-gradient-blue design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom gradient themes
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Blockchain**: Ethereum Sepolia Testnet
- **Identity**: ENS (Ethereum Name Service)
- **Messaging**: XMTP Protocol
- **Storage**: IPFS for avatars and metadata
- **Hosting**: .eth.limo decentralized hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for transactions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ensmail.git
cd ensmail
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_INFURA_KEY=your_infura_api_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Required API Keys

1. **WalletConnect Project ID**: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. **Infura API Key**: Get from [Infura](https://infura.io/) for Ethereum RPC and IPFS

## Usage

### 1. Connect Your Wallet
- Click "Connect Wallet" and select MetaMask or your preferred wallet
- Switch to Sepolia testnet if prompted
- Ensure you have some Sepolia ETH for transactions

### 2. Register Your ENS Subdomain
- Go to the Register page
- Enter your desired subdomain (e.g., "alice" for alice.mail.eth)
- Set your display name and upload an avatar (optional)
- Confirm the transaction to claim your subdomain

### 3. Start Messaging
- Navigate to the Dashboard
- Click "New Message" to start a conversation
- Enter an Ethereum address or ENS name
- Send encrypted messages instantly

### 4. Customize Your Profile
- Visit your profile page to edit information
- Update your avatar, display name, bio, and links
- Changes are stored in ENS text records and IPFS

## Architecture

### ENS Integration
- Subdomains are registered under `mail.eth` on Sepolia
- Profile data stored in ENS text records:
  - `displayName`: User's display name
  - `avatar`: IPFS URL for profile picture
  - `inboxPointer`: Wallet address for XMTP messaging
  - `description`: User bio
  - `url`: Website URL
  - `com.twitter`: Twitter handle

### XMTP Messaging
- End-to-end encrypted messaging between wallets
- Real-time message streaming
- Message history stored on XMTP network
- Support for text messages and future media attachments

### IPFS Storage
- Avatars and media files stored on IPFS
- Metadata stored as JSON on IPFS
- Multiple gateway support for reliability
- Pinning service integration for persistence

## Deployment

### .eth.limo Hosting

1. Build the static site:
```bash
npm run build
npm run export
```

2. Upload the `out` folder to IPFS
3. Set the IPFS hash in your ENS content record
4. Access your site at `yourname.eth.limo`

### Traditional Hosting

Deploy to Vercel, Netlify, or any static hosting service:

```bash
npm run build
```

## Development

### Project Structure
```
├── components/          # React components
├── lib/                # Utility libraries and services
├── pages/              # Next.js pages
├── styles/             # CSS and styling
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

### Key Components
- `ENSService`: ENS integration and subdomain management
- `XMTPService`: Messaging functionality
- `IPFSService`: File storage and retrieval
- `MessageBubble`: Individual message display
- `ConversationList`: Chat list interface
- `ProfileCard`: User profile display

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Security

- All messages are end-to-end encrypted using XMTP
- Private keys never leave your wallet
- Profile data is stored on decentralized networks
- No central servers store user data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.ensmail.eth.limo](https://docs.ensmail.eth.limo)
- Discord: [discord.gg/ensmail](https://discord.gg/ensmail)
- Twitter: [@ENSMail](https://twitter.com/ENSMail)

## Roadmap

- [ ] Group messaging support
- [ ] File and media attachments
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Integration with other ENS domains
- [ ] Advanced privacy features
- [ ] Mainnet deployment

---

Built with ❤️ for the decentralized web
