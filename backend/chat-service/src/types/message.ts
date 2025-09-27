export interface MessageRequestBody {
  from: string;
  to: string;
  message: string;
}

 export type MessageRow = {
  id: number;
  type: 'text' | 'image' | 'file';
  message: string;
  sender_id: string;
  receiver_id: string;
  url?: string;                     
  file_name?: string;             
  thumbnail_url?: string; 
  timestamp: string;
};

export type Message = {
  id: number;
  message: string;
  sent: boolean;
  time: string; // "HH:MM"
  type: 'text' | 'image' | 'file';
};