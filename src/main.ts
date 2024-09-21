import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {envs} from './config'
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter())
  app.enableCors({
    origin: 'http://localhost:3301', // Permitir solo solicitudes desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(envs.port);

  logger.log(`Gateway running on por #${ envs.port }`);
}
bootstrap();
