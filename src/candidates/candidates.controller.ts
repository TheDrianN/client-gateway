import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';

import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CANDIDATES_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';

@Controller('candidates')
export class CandidatesController {
  constructor(@Inject(CANDIDATES_SERVICE) private readonly candidatesClient: ClientProxy) {}

  @Post()
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesClient.send('createCandidate',createCandidateDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.candidatesClient.send('findAllCandidates',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }
  
  @Get('/validationUser/:id')
  validationUser(@Param('id') id: string) {
    return this.candidatesClient.send('validationUser',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidatesClient.send('findOneCandidate',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: string, @Body() updateCandidateDto: UpdateCandidateDto) {
    return this.candidatesClient.send('updateCandidate',{id, ...updateCandidateDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatesClient.send('removeCandidate',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }
}
