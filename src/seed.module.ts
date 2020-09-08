import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { Medicine } from './medicines/medicine.entity';

@Module({
    imports: [
        CommandModule,
        AuthModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              type: 'mysql',//configService.get('DB_SERVER_TYPE', 'mysql'),
              host: configService.get<string>('DB_SERVER_HOST', 'localhost'),
              port: configService.get<number>('DB_SERVER_PORT', 3306),
              username: configService.get('DB_SERVER_USERNAME', 'admin'),
              password: configService.get('DB_SERVER_PASSWORD', 'admin'),
              database: configService.get('DB_SERVER_NAME', 'vnaidb'),
              entities: [
                  User, Medicine
                ],
              synchronize: !(configService.get('NODE_ENV') === 'production'),
              logging: !(configService.get('NODE_ENV') === 'production')
            })
          })
    ],
})
export class SeedModule { }
