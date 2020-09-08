import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import * as compression from 'compression';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

function applyMiddileWare(app: NestExpressApplication, configService: ConfigService): void {
  app.use(compression());
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: <number>configService.get('RATE_LIMIT_WINDOW') || 15 * 60 * 1000, // 15 minutes
      max: <number>configService.get('RATE_LIMIT_MAX_REQUEST') || 150, // limit each IP to 100 requests per windowMs
    }),
  );
}

function initialSwagger(app: NestExpressApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Techbase pharmacy test')
    .setDescription('The document about list of API for Techbase pharmacy test')
    .setVersion('1.0')
    .setContact('Duc Tran', '', 'tranduc2702@gmail.com')
    .addBasicAuth()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);
}

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  /**
   * Applying middleware
   */
  applyMiddileWare(app, configService);
  initialSwagger(app);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false
      }
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);

  console.log(`
  =============================================
    
  Server is running on: ${await app.getUrl()} 
  
  =============================================
  `);
}

bootstrap();
