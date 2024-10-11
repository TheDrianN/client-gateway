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

  @Get('/findElectionstatusP')
  async findElectionstatusP() {
    try {
      const result = await this.electionsClient.send("findElectionstatusP", {}).toPromise();
      
      if (!result) {
        throw new RpcException('No se recibió respuesta del microservicio');
      }
    
      return result;
    } catch (err) {
      throw new RpcException('Error al conectar con el microservicio de elecciones');
    }
  }

  @Get('/findSubelectionChapter')
  async findSubelectionChapter(
    @Query('election_id', ParseIntPipe) election_id: number,
    @Query('chapter_id', ParseIntPipe) chapter_id: number
  ) {
    try {
      // Enviar la solicitud al microservicio con los parámetros recibidos
      const subelections = await this.electionsClient
        .send('findSubelectionChapter', { election_id, chapter_id })
        .pipe(
        catchError(err => {throw new RpcException(err)})
      );
      
      // Devolver la respuesta del microservicio
      return subelections;
    } catch (err) {
      // Manejar el error adecuadamente
      console.error('Error al conectar con el microservicio:', err.message || err);
      throw new RpcException('El microservicio no está disponible o hubo un error en la conexión: ' + err.message);
    }
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

  @Get('/subelections/:id')
  async findAllSubelections(@Param('id', ParseIntPipe) id: string) {
    try {
      // Intentar obtener los datos de subelecciones del microservicio
      const datasubelection = await this.electionsClient.send('getallsubelections', { id }).toPromise();
  
      // Si se obtienen los datos, procesar los subelecciones
      const processdData = await Promise.all(datasubelection.data.map(async (subelection) => {
        if (subelection.chapter_id > 0) {
          // Intentar obtener los datos del capítulo desde el microservicio correspondiente
          const chapterData = await this.chaptersClient.send('findOneChapter', { id: subelection.chapter_id }).toPromise();
          
          return {
            ...subelection,
            chapter_name: chapterData ? chapterData.data.name : null, // Verifica si existe el nombre del capítulo
          };
        }
        return {
          ...subelection,
          chapter_name: null,
        };
      }));
  
      // Retornar los datos procesados
      return {
        data: processdData,
        meta: datasubelection.meta,
      };
    } catch (err) {
      // Si ocurre algún error en la comunicación con el microservicio, manejar el error aquí
      console.error('Error al conectar con el microservicio:', err.message || err);
      throw new RpcException('El microservicio no está disponible o hubo un error en la conexión: ' + err.message);
    }
  }

  @Get('/dataelections/:id')
  async findAllDataElections(@Param('id', ParseIntPipe) id: string) {
    try {
      // Intentar obtener los datos de subelecciones del microservicio
      const datasubelection = await this.electionsClient.send('getallsubelections', { id }).toPromise();
  
    
      return datasubelection
    } catch (err) {
      // Si ocurre algún error en la comunicación con el microservicio, manejar el error aquí
      console.error('Error al conectar con el microservicio:', err.message || err);
      throw new RpcException('El microservicio no está disponible o hubo un error en la conexión: ' + err.message);
    }
  }




}
