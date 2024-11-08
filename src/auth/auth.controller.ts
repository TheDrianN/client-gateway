import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('/login')
  login(@Body() loginDto: CreateAuthDto) {
    console.log(loginDto)
    return this.authClient.send('loginAuth', loginDto).pipe(
      catchError(err => {
        throw new RpcException(err.message);
      }),
    );
  }

  @Post('/validation')
  validation(@Body() loginDto: CreateAuthDto) {
    return this.authClient.send('validation', loginDto).pipe(
      catchError(err => {
        throw new RpcException(err.message);
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