import { ID } from '@/shared/interfaces/types';

// TODO: Add selectedImage
export interface MessageData {
  _id: ID;
  chatId: ID;
  receiverId: ID;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderId: ID;
  senderUsername: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  text: string;
  isRead: boolean;
  gifUrl: string;
  reaction: string;
  createdAt: Date;
  deleteForMe: boolean;
  deleteForEveryone: boolean;
}
