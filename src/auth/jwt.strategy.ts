// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:  'secretKey', // La clave secreta debe coincidir con la usada para generar los tokens
    });
  }

  async validate(payload: any) {
    // El método `validate` se llama automáticamente si el token es válido
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
