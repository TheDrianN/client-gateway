import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { VOTING_SERVICE } from 'src/config';
import { CreateVotingDto } from './dto/create-voting.dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { UpdateVotingDto } from './dto/update-voting.dto';

@Controller('voting')
export class VotingController {
  constructor(
    @Inject(VOTING_SERVICE) private readonly votingClient: ClientProxy,
  ) {}

  @Post()
  createVoting(@Body() createVotingDto:CreateVotingDto){
    return this.votingClient.send('createVoting',createVotingDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAllVoting(@Query() paginationDto:PaginationDto){
    console.log("hola")
    return this.votingClient.send('findAllVoting',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  findOneVoting(@Param('id') id: string){
    return this.votingClient.send('findOneVoting',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );

  }

  @Delete(':id')
  deleteVoting(@Param('id') id: string){
    return this.votingClient.send('removeVoting',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );

  }

  @Patch(':id')
  updateVoting(@Param('id',ParseIntPipe) id: string, @Body() updateVotingDto: UpdateVotingDto){
    return this.votingClient.send('updateVoting',{id, ...updateVotingDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }





}
