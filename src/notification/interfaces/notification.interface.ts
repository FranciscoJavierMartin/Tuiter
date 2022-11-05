import { ID } from '@/shared/interfaces/types';

export enum NotificationType {
  comments = 'comments',
  follows = 'follows',
  messages = 'messages',
  reactions = 'reactions',
}

export interface NotificationBody {
  userTo: ID;
  userFrom: ID;
  message: string;
  notificationType: NotificationType;
  entityId: ID;
  createdItemId: ID;
  createdAt: Date;
  text: string;
  imgId: string;
  imgVersion: string;
  gifUrl: string;
}
