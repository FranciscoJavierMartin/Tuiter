import { Message } from '@/chat/models/message.model';

// TODO: Add selectedImage
export type MessageDocument = Message & {
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
};
