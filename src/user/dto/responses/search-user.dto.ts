import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiProperty({
    description: 'User id from "Users" collection',
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: 'User id from "Users" collection',
    type: String,
  })
  profilePicture: string;

  @ApiProperty({
    description: 'User name',
  })
  username: string;

  @ApiProperty({
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    description: 'Avatar color',
  })
  avatarColor: string;
}
