import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/user/models/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/onlyauth')
  @UseGuards(AuthGuard('jwt'))
  async hiddenInformation() {
    return 'hidden information';
  }

  @Get('/anyone')
  async publicInformation() {
    return 'this can be seen by anyone';
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);
    const payload = { email: user.email };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.login(loginDTO);
    const payload = { email: user.email };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
