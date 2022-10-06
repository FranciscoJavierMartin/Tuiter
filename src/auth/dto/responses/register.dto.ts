import { UserDocument } from '@/user/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseRegisterDto {
  @ApiProperty({
    description: 'Message with relevant info',
    nullable: false,
  })
  message: string;

  @ApiProperty({
    description: 'User created',
    nullable: false,
  })
  user: UserDocument;

  @ApiProperty({
    description: 'JWT Token. Ready for use',
    nullable: false,
  })
  token: string;
}
