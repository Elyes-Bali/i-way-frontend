  // Create an interface for chat message
  export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    senderName: string;  // Ensure this is included
    receiver: string;
    message: string;
    timestamp: string;
    sender: string; 
  }
  