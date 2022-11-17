import { Message } from '@/chat/models/message.model';

export type MessageJobData = MessageDocument;

export type MessageDocument = Message & {
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
};
