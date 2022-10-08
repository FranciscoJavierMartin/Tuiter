import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({
    description: 'User id from "users" collection',
  })
  userId: string;

  @ApiProperty({
    description: 'User custom id',
  })
  uId: string;

  @ApiProperty({
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
  })
  username: string;

  @ApiProperty({
    description: 'Avatar color',
  })
  avatarColor: string;
}
