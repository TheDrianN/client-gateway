import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateTypeCandidateDto } from './dto/create-type-candidate.dto';
import { UpdateTypeCandidateDto } from './dto/update-type-candidate.dto';
import { CANDIDATES_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('type-candidates')
export class TypeCandidatesController {
  constructor(@Inject(CANDIDATES_SERVICE) private readonly typecandidateClient: ClientProxy) {}

  @Post()
  create(@Body() createTypeCandidateDto: CreateTypeCandidateDto) {
    return this.typecandidateClient.send('createTypeCandidate',createTypeCandidateDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.typecandidateClient.send('findAllTypeCandidates',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typecandidateClient.send('findOneTypeCandidate',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: string, @Body() updateTypeCandidateDto: UpdateTypeCandidateDto) {
    return this.typecandidateClient.send('updateTypeCandidate',{id, ...updateTypeCandidateDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typecandidateClient.send('removeTypeCandidate',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get('/bytype/:type')
  findAllTypeCandidates(@Param('type') type:string){
    return this.typecandidateClient.send('findAllTypeCandidates2',{type}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }
}
