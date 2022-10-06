import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { RegisterDto } from '../dto/requests/register.dto';
import { ResponseRegisterDto } from '../dto/responses/register.dto';
import { AuthUser, AuthDocument } from '../schemas/auth.schema';
import {
  firstLetterUppercase,
  generateRandomIntegers,
} from '../../helpers/utils';
import { UserService } from '../../user/services/user.service';
import { UserCacheService } from 'src/user/services/user.cache.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UploaderService } from 'src/shared/services/uploader.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthUser.name) private authModel: Model<AuthDocument>,
    private uploaderService: UploaderService,
    private jwtService: JwtService,
    private userService: UserService,
    private userCacheService: UserCacheService,
    @InjectQueue('auth') private authQueue: Queue<AuthDocument>,
    @InjectQueue('user') private userQueue: Queue<UserDocument>,
  ) {}

  async create(
    registerDto: RegisterDto,
    avatarImage: Express.Multer.File,
  ): Promise<ResponseRegisterDto | any> {
    if (await this.checkIfUserExists(registerDto.email, registerDto.username)) {
      throw new BadRequestException('User is already created');
    }

    const userObjectId: ObjectId = new ObjectId();
    const authObjectId: ObjectId = new ObjectId();
    const uId = generateRandomIntegers(12).toString();

    const authUser: AuthDocument = {
      _id: authObjectId,
      uId,
      ...registerDto,
    } as AuthDocument;

    const avatarUploaded = await this.uploaderService.uploadImage(
      avatarImage,
      userObjectId.toString(),
      true,
      true,
    );

    const userDataToCache: UserDocument = this.userService.getUserData(
      authUser,
      userObjectId,
    );

    userDataToCache.profilePicture = this.uploaderService.getImageUrl(
      avatarUploaded.version,
      avatarUploaded.public_id,
    );
    await this.userCacheService.saveUserToCache(
      userObjectId.toString(),
      uId,
      userDataToCache,
    );

    this.authQueue.add('addAuthUserToDB', authUser);
    this.userQueue.add('addUserToDB', userDataToCache);

    const jwtToken: string = this.signToken(authUser, userObjectId);

    return {
      message: 'User created successfully',
      user: userDataToCache,
      token: jwtToken,
    };
  }

  async createAuthUser(authUser: AuthDocument): Promise<void> {
    const authUserCreated = new this.authModel({ ...authUser });
    await authUserCreated.save();
  }

  async checkIfUserExists(email: string, username: string): Promise<boolean> {
    return !!(await this.authModel
      .exists({
        $or: [
          { username: firstLetterUppercase(username) },
          { email: email.toLowerCase() },
        ],
      })
      .exec());
  }

  private signToken(
    { uId, email, username, avatarColor }: AuthDocument,
    userObjectId: ObjectId,
  ): string {
    return this.jwtService.sign({
      userId: userObjectId,
      uId,
      email,
      username,
      avatarColor,
    });
  }
}
