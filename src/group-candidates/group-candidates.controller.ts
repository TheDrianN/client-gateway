import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateGroupCandidateDto } from './dto/create-group-candidate.dto';
import { UpdateGroupCandidateDto } from './dto/update-group-candidate.dto';
import { CANDIDATES_SERVICE, USER_SERVICE,ELECTIONS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('group-candidates')
export class GroupCandidatesController {
  constructor(
    @Inject(CANDIDATES_SERVICE) private readonly groupcandidatesClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
    @Inject(ELECTIONS_SERVICE) private readonly electionsClient: ClientProxy // Inyecta el servicio de usuarios
  ) {}

  @Post()
  create(@Body() createGroupCandidateDto: CreateGroupCandidateDto) {
    return this.groupcandidatesClient.send('createGroupCandidate',createGroupCandidateDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  async findAll(@Query() paginationDto:PaginationDto) {
     // Convertir el Observable a Promise y obtener el resultado
      const dataGroup = await this.groupcandidatesClient.send('findAllGroupCandidates', paginationDto)
        .toPromise()
        .catch(err => {
          throw new RpcException(err);
        });

      // Procesar la data de GroupCandidates (si 'data' está presente en la respuesta)
      const processedData = await Promise.all(dataGroup.data.map(async (group) => {
       

        if (group.candidate_id) {
          // Obtener los datos del usuario en base al candidate_id
          const userData = await this.userClient.send('findOneUser', { id: group.candidate_id }).toPromise().catch(err => {
            throw new RpcException(err);
          });

          const electionData = await this.electionsClient.send("findOneElection",{id:group.sub_election_id}).toPromise().catch(err => {
            throw new RpcException(err);
          });

          // Añadir el nombre del usuario a los datos del grupo
          return {
            ...group,
            user_name: userData ? userData.data.names +' '+ userData.data.surnames: null,
            election_name: electionData ? electionData.data.title : null, // Asegurar que el nombre esté presente si existe
          };
        }

        // Si no hay candidate_id, devolver el grupo sin cambios
        return {
          ...group,
          user_name: null,
          election_name: null
        };
      }));

      return {
        data: processedData,
        meta: dataGroup.meta
      };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupcandidatesClient.send('findOneGroupCandidate',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: string, @Body() updateGroupCandidateDto: UpdateGroupCandidateDto) {
    return this.groupcandidatesClient.send('updateGroupCandidate',{id, ...updateGroupCandidateDto}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupcandidatesClient.send('removeGroupCandidate',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }
}
