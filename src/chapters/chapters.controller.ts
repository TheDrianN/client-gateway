import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { USER_SERVICE } from 'src/config';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { PaginationDto } from 'src/common';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(
    @Inject(USER_SERVICE) private readonly chaptersClient : ClientProxy,) 
  {}

  @Post()
  createChapter(@Body() createChapterDto: CreateChapterDto){
    return this.chaptersClient.send('createChapter',createChapterDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAllChapter(@Query() paginationDto:PaginationDto){
    return this.chaptersClient.send('findAllChapters',paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  finOne(@Param('id') id: string){
    return this.chaptersClient.send('findOneChapter',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Delete(':id')
  deleteChapter(@Param('id') id: string){
    return this.chaptersClient.send('removeChapter',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Patch(':id')
  updateChapter(@Param('id', ParseIntPipe) id : string ,@Body() updateChapterDto :UpdateChapterDto){
    return this.chaptersClient.send('updateChapter',{id,...updateChapterDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }
}
