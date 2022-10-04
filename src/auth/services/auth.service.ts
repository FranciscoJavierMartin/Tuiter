import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { RegisterDto } from '../dto/requests/register.dto';
import { ResponseRegisterDto } from '../dto/responses/register.dto';
import { AuthUser, AuthDocument } from '../schemas/auth.schema';
import { generateRandomIntegers } from '../../helpers/utils';
import { UserService } from '../../user/services/user.service';
import { UserCacheService } from 'src/user/services/user.cache.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthUser.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private userService: UserService,
    private userCacheService: UserCacheService,
    @InjectQueue('auth') private authQueue: Queue,
  ) {}

  async create(registerDto: RegisterDto): Promise<ResponseRegisterDto | any> {
    console.log('Register');
    const job = await this.authQueue.add('addAuthUserToDB', {
      value: {
        foo: 'bar',
        mio: 'set',
      },
    });

    // const uId = generateRandomIntegers(12).toString();
    // const userObjectId: ObjectId = new ObjectId();

    // const authUserCreated = new this.authModel({ ...registerDto, uId });
    // const authUser = await authUserCreated.save();

    // // TODO: Upload image

    // const userDataToCache: UserDocument = this.userService.getUserData(
    //   authUser,
    //   userObjectId,
    // );

    // await this.userCacheService.saveUserToCache(
    //   userObjectId.toString(),
    //   uId,
    //   userDataToCache,
    // );

    // const job = await this.authQueue.add('addAuthUserToDB', {
    //   value: authUser,
    // });

    // const job = await this.authQueue.add('addAuthUserToDB', {
    //   value: {
    //     foo: 'bar',
    //     mio: 'set',
    //   },
    // });
    // return {
    //   message: 'User created successfully',
    //   user,
    //   token: this.jwtService.sign({
    //     email: user.email,
    //     username: user.username,
    //     avatarColor: user.avatarColor,
    //   }),
    // };
  }

  // private async checkIfUserExists(username: string, email: string): Promise<boolean> {

  // }
}
