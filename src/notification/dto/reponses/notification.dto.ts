import { ApiProperty } from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';
import { NotificationType } from '@/notification/interfaces/notification.interface';

class UserInfo {
  @ApiProperty({
    description: 'User profile picture url',
    required: false,
  })
  profilePicture: string;

  @ApiProperty({
    description: 'User name',
    required: true,
    uniqueItems: true,
    example: 'John',
  })
  username: string;

  @ApiProperty({
    description: 'User avatar color',
    required: false,
    example: 'blue',
  })
  avatarColor: string;

  @ApiProperty()
  uId: string;
}

export class NotificationDto {
  @ApiProperty({
    description: 'Notification id',
    type: String,
    required: true,
    example: '6352eb20e5f1c6d76008deec',
  })
  _id: ID;

  @ApiProperty({
    description: 'User receiver id',
    type: String,
    required: true,
    example: '6352eb20e5f1c6d76008deec',
  })
  userTo: ID;

  @ApiProperty({
    description: 'User sender info',
    type: UserInfo,
    required: true,
  })
  userFrom: UserInfo;

  @ApiProperty({
    description: 'Is notification read?',
    type: Boolean,
    required: true,
    default: false,
  })
  read: boolean;

  @ApiProperty({
    description: 'Message to be displayed on client',
    type: String,
    required: false,
    default: '',
  })
  message: string;

  @ApiProperty({
    description: 'Message to be displayed on client',
    enum: NotificationType,
    required: true,
  })
  notificationType: NotificationType;

  @ApiProperty({
    description: 'Entity who created the notification (Post, comment, etc)',
    type: String,
    required: true,
    example: '6352eb20e5f1c6d76008deec',
  })
  entityId: ID;

  @ApiProperty({
    description: 'Id from object created when notification was called',
    type: String,
    required: true,
    example: '6352eb20e5f1c6d76008deec',
  })
  createdItemId: ID;

  @ApiProperty({
    description: 'Image Id (Cloudinary)',
    type: String,
    required: false,
    default: '',
  })
  imgId: string;

  @ApiProperty({
    description: 'Image Version (Cloudinary)',
    type: String,
    required: false,
    default: '',
  })
  imgVersion: string;

  @ApiProperty({
    description: 'Gif url (if exists)',
    type: String,
    required: false,
    default: '',
  })
  gifUrl: string;

  @ApiProperty({
    description: 'Notification creation date',
    type: Date,
    required: true,
  })
  createdAt: Date;
}
