import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('/login')
  login(@Body() loginDto: { document: string; password: string }) {

    return this.authClient.send('loginAuth', loginDto).pipe(
      catchError(err => {
        throw new RpcException(err.message);
      }),
    );
  }

  @Get('/prueba')
  prueba() {
    return this.authClient.send('prueba', {}).pipe(
      catchError((err) => {
        console.error('Error recibido del microservicio:', err);
        // Puedes lanzar una excepción o manejar el error de la manera que prefieras
        return throwError(() => new Error(err.message || 'Error al comunicarse con el microservicio'));
      }),
    );
  }


}