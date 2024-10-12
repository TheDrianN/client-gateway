// src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { url } = request;
    
        // Si la ruta es /auth/login, permite el acceso sin verificar el token
        if (url === '/api/auth/login') {
          return true;
        }

        if (url === '/api/auth/validation') {
          return true;
        }
    
        // Si la ruta no es /auth/login, aplica el guard normalmente
        return super.canActivate(context);
      }
}
