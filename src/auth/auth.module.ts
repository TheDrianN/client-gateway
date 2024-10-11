import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, envs } from 'src/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard],
  imports:[
    ClientsModule.register([
      {
        name: AUTH_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.authMicroservicesHost,
          port: envs.authMicroservicesPort
        }
        
      }
      
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:  'secretKey', // La misma clave secreta utilizada para firmar los tokens
      signOptions: { expiresIn: '1h' },
    }),
  ]
})
export class AuthModule {}
