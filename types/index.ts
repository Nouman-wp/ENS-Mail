export interface ENSProfile {
  subname: string;
  displayName?: string;
  avatar?: string;
  inboxPointer?: string;
  address: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  read: boolean;
  fromENS?: string;
  toENS?: string;
}

export interface Conversation {
  peerAddress: string;
  peerENS?: string;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
}

export interface WalletState {
  address?: string;
  ensName?: string;
  isConnected: boolean;
  chainId?: number;
}

export interface IPFSFile {
  hash: string;
  name: string;
  size: number;
  type: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email?: string;
}

export interface UserProfile extends ENSProfile {
  notifications: NotificationSettings;
  createdAt: Date;
  lastActive: Date;
}
