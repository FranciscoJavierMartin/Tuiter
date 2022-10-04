import { UserDocument } from '../../../user/schemas/user.schema';

export class ResponseRegisterDto {
  message: string;
  user: UserDocument;
  token: string;
}
