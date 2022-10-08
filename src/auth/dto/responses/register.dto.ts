import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/auth/dto/responses/user.dto';

export class ResponseRegisterDto {
  @ApiProperty({
    description: 'Message with relevant info',
    nullable: false,
  })
  message: string;

  @ApiProperty({
    description: 'User created',
    nullable: false,
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    description: 'JWT Token. Ready for use',
    nullable: false,
  })
  token: string;
}
