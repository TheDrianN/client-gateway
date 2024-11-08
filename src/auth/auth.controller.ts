import { Controller, Post, Body, Inject, Get, HttpStatus } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('/login')
  login(@Body() loginDto: CreateAuthDto) {
    return this.authClient.send('loginAuth', loginDto).pipe(
      catchError(err => {
        throw new RpcException(err.message);
      }),
    );
  }

  @Post('/validation')
validation(@Body() loginDto: CreateAuthDto) {
  return this.authClient.send('validation', loginDto).pipe(
    catchError((err) => {
      console.error('Error capturado:', err);

      // Si el error es un objeto con más detalles, puedes manejarlo mejor aquí
      const errorMessage = err.message || 'Error desconocido en el microservicio';
      const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;

      // Lanza una excepción personalizada con mensaje y estado
      throw new RpcException({
        message: errorMessage,
        statusCode,
      });
    }),
  );
}


  @Post('/votingconfirmation')
  votingconfirmation(@Body() loginDto: { id: number; message:string }) {
    return this.authClient.send('votingconfirmation', loginDto).pipe(
      catchError(err => {
        throw new RpcException(err.message);
      }),
    );
  }


}