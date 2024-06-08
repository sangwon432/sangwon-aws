import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoggedinUserDto } from '../user/dto/loggedin-user.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';
import { AccessTokenGuard } from '../guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loggedInUser(@Req() req: RequestWithUserInterface) {
    // return await req.user;
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }
  // async loggedInUser(@Body() loggedinUserDto: LoggedinUserDto) {
  //   // return await this.authService.logInUser(loggedinUserDto);
  //   const user = await this.authService.logInUser(loggedinUserDto);
  //   const token = await this.authService.generateAccessToken(user.id);
  //   return { user, token };
  // }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getUserInfo(@Req() req: RequestWithUserInterface) {
    return await req.user;
  }

  @Post('/email/test')
  async sendEmailTest(@Body('email') email: string) {
    return await this.authService.initEmailVerification(email);
  }
}
