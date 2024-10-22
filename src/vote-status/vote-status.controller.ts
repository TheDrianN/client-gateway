import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateVoteStatusDto } from './dto/create-vote-status.dto';
import { CANDIDATES_SERVICE, VOTING_SERVICE } from 'src/config';
import { ClientProxy,RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('vote-status')
export class VoteStatusController {
  constructor(
    @Inject(VOTING_SERVICE) private readonly votestatusClient: ClientProxy,
    

  ) {}

  @Post()
  create(@Body() createVoteStatusDto: CreateVoteStatusDto) {
    return this.votestatusClient.send('createVoteStatus',createVoteStatusDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.votestatusClient.send('findAllVoteStatus',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get('/validationUser/:id')
  validationUser(@Param('id') id: string) {
    return this.votestatusClient.send('validationUser',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  
  @Post('/validationStatus')
  validationStatus(
    @Body('id_user', ParseIntPipe) id_user: number, 
    @Body('id_election', ParseIntPipe) id_election: number
  ) {
    return this.votestatusClient.send('validationStatus', { id_user, id_election }).pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votestatusClient.send('findOneVoteStatus',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }


 
}
