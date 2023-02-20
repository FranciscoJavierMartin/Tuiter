import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/user/dto/responses/user.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseRegisterDto {
  @ApiProperty({
    description: 'Message with relevant info',
    nullable: false,
  })
  @Field(() => String, { description: 'Info message' })
  message: string;

  @ApiProperty({
    description: 'User created',
    nullable: false,
    type: UserDto,
  })
  @Field(() => UserDto, { description: 'User info' })
  user: UserDto;

  @ApiProperty({
    description: 'JWT Token. Ready for use',
    nullable: false,
  })
  @Field(() => String, { description: 'JSON Web Token. For authentication' })
  token: string;
}
