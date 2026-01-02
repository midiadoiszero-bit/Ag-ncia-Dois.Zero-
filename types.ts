
export interface Attachment {
  name: string;
  type: string;
  data: string; // base64
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  attachments?: Attachment[];
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
