import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { UserSeed } from './seed/user.seed';
import { CommandModule } from 'nestjs-command';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
    CommandModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserSeed,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    UserSeed
  ],
})
export class AuthModule {}
