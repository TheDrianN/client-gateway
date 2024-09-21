import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { catchError } from 'rxjs';
import { VOTER_ACCESS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateVoterAccessDto } from './dto/create-voter_access.dto';
import { UpdateVoterAccessDto } from './dto/update-voter_access.dto';



@Controller('voter-access')
export class VoterAccessController {

  constructor(
    @Inject(VOTER_ACCESS_SERVICE) private readonly voteraccessClient: ClientProxy,
  ) {}

  @Post()
  createMember(@Body() createVoterAccessDto:CreateVoterAccessDto){
    return this.voteraccessClient.send('createVoterAccess',createVoterAccessDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAllMembers(@Query() paginationDto: PaginationDto){
    return this.voteraccessClient.send('findAllVoterAccess',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string){

    return  this.voteraccessClient.send('findOneVoterAccess',{id})
    .pipe(
      catchError(err => {throw new RpcException(err)})
    );
    
    
  }

  @Delete(':id')
  deleteMember(@Param('id') id: number){
    return this.voteraccessClient.send('removeVoterAccess',{ id }).pipe(
      catchError(err => {throw new RpcException(err)})
    );

  }

  @Patch(':id')
  patchMember(@Param('id',ParseIntPipe) id: number,@Body() updateVoterAccessDto:UpdateVoterAccessDto){
    return this.voteraccessClient.send('updateVoterAccess',{id,...updateVoterAccessDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );

  }
}
