import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}


  @Post()
  createUser(@Body() createUserDto:CreateUserDto){
    return this.userClient.send('createUser',createUserDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAllUsers(@Query() paginationDto: PaginationDto){
    return this.userClient.send('findAllUsers',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  finOne(@Param('id') id : string){
    return this.userClient.send('findOneUser',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string){
    return this.userClient.send('removeUser',{ id }).pipe(
      catchError(err => {throw new RpcException(err)})
    );

  }
  
  @Patch(':id')
  patchUser(@Param('id',ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto){
    return this.userClient.send('updateUser',{id,...updateUserDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get('/shearchDoc/:doc')
  shearchDoc(@Param('doc') doc : string){
    return this.userClient.send('shearchDoc',{doc}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

}
