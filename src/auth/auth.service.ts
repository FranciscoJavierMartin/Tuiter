import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/requests/register.dto';
import { ResponseRegisterDto } from './dto/responses/register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(registerDto: RegisterDto): Promise<ResponseRegisterDto> {
    const userCreated = new this.userModel(registerDto);
    const user = await userCreated.save();

    return {
      message: 'User created successfully',
      user,
      token: this.jwtService.sign({
        email: user.email,
        username: user.username,
        avatarColor: user.avatarColor,
      }),
    };
  }
}
