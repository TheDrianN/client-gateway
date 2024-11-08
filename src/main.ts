import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {envs} from './config'
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Importa el guard para proteger la ruta

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

  console.log("hos1",envs.authMicroservicesHost);
  console.log("port1",envs.authMicroservicesPort);


  app.useGlobalGuards(new JwtAuthGuard()); // Usa el guard personalizado

  app.useGlobalFilters(new RpcCustomExceptionFilter())
  app.enableCors({
    origin: 'https://main.d1t2uoj1umwfc7.amplifyapp.com', // Permitir solo solicitudes desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(envs.port);

  logger.log(`Gateway running on por #${ envs.port }`);
}
bootstrap();
