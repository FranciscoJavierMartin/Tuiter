import { ID } from '@/shared/interfaces/types';
import { Feelings } from '@/reaction/interfaces/reaction.interface';
import { Message } from '@/chat/models/message.model';

export type MessageJobData = MessageDocument | AddReactionToMessageJobData;

export type MessageDocument = Message & {
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
};

export interface AddReactionToMessageJobData {
  messageId: ID;
  feeling: Feelings;
}
