import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoggedinUserDto } from '../user/dto/loggedin-user.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { EmailVerficationDto } from '../user/dto/email-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  //회원가입 프로세스
  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    newUser.password = undefined;
    return newUser;
  }

  async logInUser(loggedinUserDto: LoggedinUserDto) {
    const user = await this.userService.getUserByEmail(loggedinUserDto.email);
    const isPasswordMatched = await bcrypt.compare(
      loggedinUserDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException(
        'password does not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.password = undefined;
    return user;
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESSTOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESSTOKEN_EXPIRATION_TIME')}`,
    });
    return token;
  }

  async initEmailVerification(email: string) {
    const generateNo = this.generateOTP();
    //자동 생성된 번호를 redis에 저장, 키: 밸류로 저장
    await this.cacheManager.set(email, generateNo);

    await this.emailService.sendMail({
      to: email,
      subject: 'check email test',
      text: `The confirmation number is as follows. ${generateNo}`,
    });
    return 'please check your email';
  }

  generateOTP() {
    let OTP = '';

    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }

  async confirmEmailVerification(emailVerficationDto: EmailVerficationDto) {
    const { email, code } = emailVerficationDto;
    const codeFromRedis = await this.cacheManager.get(email);
    if (codeFromRedis !== code) {
      throw new BadRequestException('Wrong code provided');
    }
    await this.cacheManager.del(email);
    return 'success';
  }

  // async sendEmailTest(email: string) {
  //   await this.emailService.sendMail({
  //     to: email,
  //     subject: 'check email test',
  //     text: 'The confirmation number is as follows',
  //   });
  //   return 'please check your email';
  // }
}
