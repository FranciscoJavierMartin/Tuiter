import { NotificationType } from '@/notification/interfaces/notification.interface';
import { UserDocument } from '@/user/models/user.model';

export enum SocialLinksType {
  facebook = 'facebook',
  instagram = 'instagram',
  twitter = 'twitter',
  youtube = 'youtube',
}

export type NotificationSettings = Record<NotificationType, boolean>;
export type SocialLinks = Record<SocialLinksType, string>;

export interface ResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface BasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

export interface SearchUser {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  avatarColor: string;
}

export interface SocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface Login {
  userId: string;
}

export interface UserJobInfo {
  key?: string;
  value?: string | SocialLinksType;
}

export interface UserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | NotificationSettings | UserDocument;
}

export interface EmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface AllUsers {
  users: UserDocument[];
  totalUsers: number;
}
