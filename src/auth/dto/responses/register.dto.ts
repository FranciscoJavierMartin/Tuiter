import { UserDocument } from '../../schemas/auth.schema';

export class ResponseRegisterDto {
  message: string;
  user: UserDocument;
  token: string;
}
