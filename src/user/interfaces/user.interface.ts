import { UserDocument } from '@/user/models/user.model';

export interface ResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface NotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface BasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

// TODO: Refactor to Record type
export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
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
  value?: string | SocialLinks;
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
