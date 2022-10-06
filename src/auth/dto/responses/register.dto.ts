import { UserDocument } from '@/user/models/user.model';

export class ResponseRegisterDto {
  message: string;
  user: UserDocument;
  token: string;
}
