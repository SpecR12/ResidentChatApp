//interfetele pentru modele (user, message)

export interface User{
  id: String;
  username: String;
  email: String;
  avatarColor: string;
}
export interface Message {
  id: String;
  senderId: String;
  senderName: String;
  senderColor: String;
  content: string;
  timestamp: Date;
  type: 'TEXT' | 'SYSTEM';
}

