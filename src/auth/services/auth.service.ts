import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { UploadApiResponse } from 'cloudinary';
import { firstLetterUppercase, generateRandomIntegers } from '@/helpers/utils';
import { UploaderService } from '@/shared/services/uploader.service';
import { UserService } from '@/user/services/user.service';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserDocument } from '@/user/models/user.model';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';
import { AuthUser, AuthDocument } from '@/auth/models/auth.model';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { UserDto } from '@/auth/dto/responses/user.dto';
import { MailWorkerData } from '@/shared/emails/interfaces/email';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthUser.name) private authModel: Model<AuthDocument>,
    private uploaderService: UploaderService,
    private jwtService: JwtService,
    private userService: UserService,
    private userCacheService: UserCacheService,
    private readonly configService: ConfigService,
    @InjectQueue('auth') private authQueue: Queue<AuthDocument>,
    @InjectQueue('user') private userQueue: Queue<UserDocument>,
    @InjectQueue('email') private emailQueue: Queue<MailWorkerData>,
  ) {}

  /**
   * Create user (auth and user) in db and cache
   * @param registerDto User data
   * @param avatarImage User avatar file
   * @returns User created and JWT token
   */
  public async create(
    registerDto: RegisterDto,
    avatarImage: Express.Multer.File,
  ): Promise<ResponseRegisterDto> {
    let avatarUploaded: UploadApiResponse;

    if (await this.checkIfUserExists(registerDto.email, registerDto.username)) {
      throw new BadRequestException('User is already created');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = generateRandomIntegers(12).toString();

    const authUser: AuthDocument = {
      _id: authObjectId,
      uId,
      ...registerDto,
    } as AuthDocument;

    try {
      avatarUploaded = await this.uploaderService.uploadImage(
        avatarImage,
        userObjectId.toString(),
        true,
        true,
      );
    } catch (error) {
      throw new BadGatewayException('External server error');
    }

    const userDataToCache: UserDocument = this.userService.getUserData(
      authUser,
      userObjectId,
    );

    userDataToCache.profilePicture = this.uploaderService.getImageUrl(
      avatarUploaded.version,
      avatarUploaded.public_id,
    );
    await this.userCacheService.storeUserToCache(
      userObjectId.toString(),
      uId,
      userDataToCache,
    );

    this.authQueue.add('addAuthUserToDB', authUser);
    this.userQueue.add('addUserToDB', userDataToCache);

    const jwtToken: string = this.signToken(authUser, userObjectId);

    return {
      message: 'User created successfully',
      user: new UserDto(userDataToCache),
      token: jwtToken,
    };
  }

  /**
   * Get user from DB and attach a JWT
   * @param loginDto User data to login
   * @returns User from DB and JWT
   */
  public async login(loginDto: LoginDto): Promise<ResponseRegisterDto> {
    const authUser: AuthDocument = await this.getAuthUserByUsername(
      loginDto.username,
    );

    if (!authUser || !authUser.comparePassword(loginDto.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const user: UserDocument = await this.userService.getUserByAuthId(
      authUser.id,
    );

    const userJwt: string = this.jwtService.sign({
      userId: user._id,
      uId: authUser.uId,
      email: authUser.email,
      username: authUser.username,
      avatarColor: authUser.avatarColor,
    });

    const userDocument: UserDocument = {
      ...user,
      authId: authUser._id,
      username: authUser.username,
      email: authUser.email,
      avatarColor: authUser.avatarColor,
      uId: authUser.uId,
      createdAt: authUser.createdAt,
    } as UserDocument;

    return {
      message: 'User login successfuly',
      user: new UserDto(userDocument),
      token: userJwt,
    };
  }

  /**
   * Create auth user in DB
   * @param authUser auth user to be created
   */
  public async createAuthUser(authUser: AuthDocument): Promise<void> {
    const authUserCreated = new this.authModel({ ...authUser });
    await authUserCreated.save();
  }

  /**
   * Check if users exists in db by email or username
   * @param email
   * @param username
   * @returns True if user exists, False otherwise
   */
  public async checkIfUserExists(
    email: string,
    username: string,
  ): Promise<boolean> {
    return !!(await this.authModel
      .exists({
        $or: [
          { username: firstLetterUppercase(username) },
          { email: email.toLowerCase() },
        ],
      })
      .exec());
  }

  /**
   * Get auth user by username
   * @param username User name
   * @returns User from DB
   */
  public async getAuthUserByUsername(username: string): Promise<AuthDocument> {
    return await this.authModel
      .findOne({
        username: firstLetterUppercase(username),
      })
      .exec();
  }

  /**
   * Get auth user by email
   * @param email User email
   * @returns User from DB
   */
  public async getAuthUserByEmail(email: string): Promise<AuthDocument> {
    return await this.authModel
      .findOne({
        email: email.toLowerCase(),
      })
      .exec();
  }

  /**
   * Get user from cache or DB
   * @param userId User id to find it
   * @returns User from cache or DB
   */
  public async getUser(userId: string): Promise<UserDocument> {
    const cachedUser: UserDocument =
      await this.userCacheService.getUserFromCache(userId);

    const existingUser: UserDocument =
      cachedUser ?? (await this.userService.getUserById(userId));

    return existingUser;
  }

  public async sendForgotPasswordEmail(email: string): Promise<void> {
    const authUser: AuthDocument = await this.getAuthUserByEmail(email);

    if (!authUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');

    await this.authModel.updateOne(
      {
        _id: authUser._id,
      },
      {
        passwordResetToken: randomCharacters,
        passwordResetExpires: Date.now() * 60 * 60 * 1000,
      },
    );

    this.emailQueue.add('sendForgotPasswordEmail', {
      receiverEmail: email,
      username: authUser.username,
      token: randomCharacters,
    });
  }

  /**
   * Create JWT token
   * @param payload user data to be included in payload
   * @param userObjectId user id in db
   * @returns JWT Token
   */
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
