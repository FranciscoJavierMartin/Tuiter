import { UserDocument } from '../../schemas/user.schema';

export class ResponseRegisterDto {
  message: string;
  user: UserDocument;
  token: string;
}
