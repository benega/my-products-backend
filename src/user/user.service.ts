import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/models/user';
import { RegisterDTO } from './models/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/user/models/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(registerDto: RegisterDTO) {
    const { email } = registerDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(registerDto);

    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async login(loginDto: LoginDTO) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);

    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }
}
