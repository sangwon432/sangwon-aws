import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TerminusModule } from '@nestjs/terminus';
import { BlogModule } from './blog/blog.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    DatabaseModule,
    TerminusModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),
        SERVER_PORT: Joi.number().required(),
        JWT_ACCESSTOKEN_SECRET: Joi.string().required(),
        JWT_ACCESSTOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    BlogModule,
    EmailModule,
    UserModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
