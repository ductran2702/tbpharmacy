import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User, AIProvider } from 'src/modules/user/entities/user.entity';
// import { Solution } from 'src/modules/solution/entities/solution.entity';
// import { FavouriteSolution } from 'src/modules/solution/entities/favourite.entity';
// import { SolutionDemo } from 'src/modules/solution/entities/solution-demo.entity';
// import { SolutionScreenshot } from 'src/modules/solution/entities/solution-screenshot.entity';
// import { Industry } from 'src/modules/industry/entitites/industry.entity';
// import { Technology } from 'src/modules/technology/entitites/technology.entity';
// import { SolutionTag } from 'src/modules/solution/entities/tag.entity';
// import { PricingPlan } from 'src/modules/pricing/entities/pricing-plan.entity';
// import { Admin } from 'src/modules/user/entities/admin.entity';
// import { Customer } from 'src/modules/user/entities/customer.entity';

@Module({
  imports: [
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
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: !(configService.get('NODE_ENV') === 'production'),
        logging: !(configService.get('NODE_ENV') === 'production'),
        charset: "utf8mb4_unicode_ci"
      })
    })
  ]
})
export class DatabaseModule { }
