import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import * as crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { Queue } from 'bull';
import { UploadApiResponse } from 'cloudinary';
import * as moment from 'moment';
import { generateRandomIntegers } from '@/helpers/utils';
import {
  MailForgotPasswordData,
  MailResetPasswordData,
} from '@/shared/emails/interfaces/email';
import { UploaderService } from '@/shared/services/uploader.service';
import { UserService } from '@/user/services/user.service';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserDocument } from '@/user/interfaces/user.interface';
import { UserRepository } from '@/user/repositories/user.repository';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';
import { AuthDocument } from '@/auth/models/auth.model';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { UserDto } from '@/auth/dto/responses/user.dto';
import { AuthRepository } from '@/auth/repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly userCacheService: UserCacheService,
    @InjectQueue('auth') private readonly authQueue: Queue<AuthDocument>,
    @InjectQueue('user') private readonly userQueue: Queue<UserDocument>,
    @InjectQueue('email')
    private readonly emailQueue: Queue<
      MailForgotPasswordData | MailResetPasswordData
    >,
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

    if (
      await this.authRepository.checkIfUserExists(
        registerDto.email,
        registerDto.username,
      )
    ) {
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
    const authUser: AuthDocument =
      await this.authRepository.getAuthUserByUsername(loginDto.username);

    if (!authUser || !authUser.comparePassword(loginDto.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const user: UserDocument = await this.userRepository.getUserByAuthId(
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
   * Get user from cache or DB
   * @param userId User id to find it
   * @returns User from cache or DB
   */
  public async getUser(userId: string): Promise<UserDocument> {
    const cachedUser: UserDocument =
      await this.userCacheService.getUserFromCache(userId);

    const existingUser: UserDocument =
      cachedUser ?? (await this.userRepository.getUserById(userId));

    return existingUser;
  }

  /**
   * Send email to user with a link to reset its password
   * @param email email to be sent
   */
  public async sendForgotPasswordEmail(email: string): Promise<void> {
    const authUser: AuthDocument = await this.authRepository.getAuthUserByEmail(
      email,
    );

    if (!authUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');

    await this.authRepository.updatePasswordResetToken(
      authUser._id,
      randomCharacters,
    );

    this.emailQueue.add('sendForgotPasswordEmail', {
      receiverEmail: email,
      username: authUser.username,
      token: randomCharacters,
    });
  }

  /**
   * Send email to user informing about that its password has been change
   * @param newPassword User new password
   * @param token Token to reset password
   * @param ip User ip
   */
  public async sendResetPasswordEmail(
    newPassword: string,
    token: string,
    ip: string,
  ): Promise<void> {
    const authUser: AuthDocument =
      await this.authRepository.getAuthUserByPasswordToken(token);

    if (!authUser) {
      throw new BadRequestException('Token has expired');
    }

    authUser.password = newPassword;
    authUser.passwordResetExpires = undefined;
    authUser.passwordResetToken = undefined;
    await authUser.save();

    this.emailQueue.add('sendResetPasswordEmail', {
      username: authUser.username,
      receiverEmail: authUser.email,
      ipaddress: ip,
      date: moment().format('DD/MM/YYYY HH:mm'),
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
