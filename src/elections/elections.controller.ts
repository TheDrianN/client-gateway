import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { ELECTIONS_SERVICE,USER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('elections')
export class ElectionsController {
  constructor(
    @Inject(ELECTIONS_SERVICE) private readonly electionsClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly chaptersClient: ClientProxy,

  ) {}

  @Post()
  create(@Body() createElectionDto: CreateElectionDto) {
    return this.electionsClient.send("createElection",createElectionDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.electionsClient.send("findAllElections",paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electionsClient.send("findOneElection",{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: string, @Body() updateElectionDto: UpdateElectionDto) {
    return this.electionsClient.send("updateElection",{id,...updateElectionDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electionsClient.send("removeElection",{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id/subelections')
  async findAllSubelections(@Param('id', ParseIntPipe) id: string) {
    const datasubelection = await this.electionsClient.send('getallsubelections', {id}).toPromise()
    .catch(err => {
      throw new RpcException(err);
    });

    const processdData = await Promise.all(datasubelection.data.map(async (subelection)=>{
      if(subelection.chapter_id > 0){
        const chapterData = await this.chaptersClient.send('findOneChapter',{id: subelection.chapter_id}).toPromise().catch(err => {
          throw new RpcException(err);
        });

        return {
          ...subelection,
          chapter_name: chapterData ? chapterData.data.name : null, // Asegurar que el nombre esté presente si existe
        };
      }
      return {
        ...subelection,
        chapter_name: null
      };
    }));
    return {
      data: processdData,
      meta: datasubelection.meta
    };
  }


}
