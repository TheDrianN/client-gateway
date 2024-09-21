import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateSubElectionDto } from './dto/create-sub-election.dto';
import { UpdateSubElectionDto } from './dto/update-sub-election.dto';
import { ELECTIONS_SERVICE, USER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('sub-elections')
export class SubElectionsController {
  constructor(
    @Inject(ELECTIONS_SERVICE) private readonly subElectionClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly chaptersClient: ClientProxy,

  ) {}

  @Post()
  create(@Body() createSubElectionDto: CreateSubElectionDto) {
    return this.subElectionClient.send("createSubElection",createSubElectionDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const datasubelection = await this.subElectionClient.send("findAllSubElections", paginationDto).toPromise()
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subElectionClient.send("findOneSubElection",{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: string, @Body() updateSubElectionDto: UpdateSubElectionDto) {
    return this.subElectionClient.send("updateSubElection",{id,...updateSubElectionDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subElectionClient.send("removeSubElection",{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get('/subelectionsbystatus/:id')
  finAllSubElectionbyStatus(@Param('id') id: string) {
   
    return this.subElectionClient.send("finAllSubElectionbyStatus",{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }
}
