import { Socket } from 'socket.io-client';

export type SocketContextType = {
  socket: Socket | null; // The socket instance for real-time communication
  onlineUsers: string[];      // An array of user IDs who are currently online
}


export type LastMessage = {
  content: string;
  type: 'text' | 'image' | 'file' | 'audio';
};


export type Contact = {
  id: number;
  name: string;
  username: string;
  message: string;
  avatar: string;
  online: boolean;
  lastSeen: number;
  lastMessage?: LastMessage;
  blocked?: boolean; // Optional field to indicate if the contact is blocked
  blockedBy?: number; // Optional field to indicate who blocked the contact
};

export type UpdateMessage = {
  deleted: boolean;
  edited: boolean;
  id: number;
}

// list of friends component
export type ListFriendsProps = {
  contactsList: Contact[];
  setContactsList: React.Dispatch<React.SetStateAction<Contact[]>>;
  showSidebar: boolean;
  selectedChat: Contact | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Contact | null>>;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string; // Optional, if you want to pass the search query
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  reorderContacts: (contactId: number) => void; // Function to reorder contacts
  updateMessage: UpdateMessage
  setUpdateMessage: React.Dispatch<React.SetStateAction<UpdateMessage>>;
};

// Main chat component
export type MainChatProps = {
  // to remove
  currentUserId: number;
  // end remove
  contact: Contact | null; // The contact currently being chatted with
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  reorderContacts: (contactId: number) => void; // Function to reorder contacts
  setContactsList: React.Dispatch<React.SetStateAction<Contact[]>>; // Function to
  setSelectedChat: React.Dispatch<React.SetStateAction<Contact | null>>;
  // function start call 
  startCall: (contactId: number, type: "audio" | "video") => void; // Function to initiate a call
  incomingCall: IncomingCall | null; // The incoming call offer, if any
  isCallActive: boolean; // To indicate if a call is currently active
  setUpdateMessage: React.Dispatch<React.SetStateAction<UpdateMessage>>;
};


// chat input component
export type ChatInputProps = {
  error: string; // Optional error message
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean; // To indicate if a file is being uploaded
  inputValue: string; // The current value of the input
  handleSendMessage: () => void; // Function to handle sending messages
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>; // Function to set error messages
  friendId: number; // Optional friend ID for context
};


// Message type for chat messages
export type Message = {
  id: number;
  type: 'text' | 'image' | 'file' | 'audio';
  message?: string;                 // For text content or file captions
  url?: string;                     // For image or file URLs
  fileName?: string;                // To store the original name of a file
  thumbnailUrl?: string;            // For pdf files thumbnails
  time: string;
  sent: boolean;
  from?: number; // User ID of the sender
  to?: number;   // User ID of the recipient
};

// Define a type for an incoming call offer
export type IncomingCall = {
  from: string;
  offer: RTCSessionDescriptionInit;
  type: "audio" | "video";
  fromName: string;
}
