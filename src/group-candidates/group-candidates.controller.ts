import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateGroupCandidateDto } from './dto/create-group-candidate.dto';
import { UpdateGroupCandidateDto } from './dto/update-group-candidate.dto';
import { CANDIDATES_SERVICE, USER_SERVICE,ELECTIONS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError,firstValueFrom } from 'rxjs';
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

  @Get('/validationSubElection/:id')
  validationSubElection(@Param('id') id: string) {
    return this.groupcandidatesClient.send('validationSubElection',{id}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get('/findAllCandidatesSubElection/:id')
  findAllCandidatesSubElection(@Param('id') id: string) {
    return this.groupcandidatesClient.send('findAllCandidatesSubElection',{id}).pipe(
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

          const electionData = await this.electionsClient.send("findOneSubElection",{id:group.sub_election_id}).toPromise().catch(err => {
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
  async findOne(@Param('id') id: string) {

    // Usar firstValueFrom para convertir el Observable a Promise
    const dataGroup = await firstValueFrom(
      this.groupcandidatesClient.send('findOneGroupCandidate', { id })
    ).catch(err => {
      throw new RpcException(err);
    });

  
    // Asegúrate de que 'dataGroup' y 'dataGroup.data.candidates' estén presentes
    if (!dataGroup || !dataGroup.data || !dataGroup.data.candidates) {
      throw new RpcException('No se encontraron candidatos en el grupo.');
    }
  

    // Procesar la información de los candidatos y obtener los datos de usuario
    const processedData = await Promise.all(
      dataGroup.data.candidates.map(async (candidate: any) => {
        // Verificar si el candidato tiene un user_id válido
        const userId = candidate.user_id;
        
        if (candidate.user_id) {
          try {
            // Llamada al microservicio de usuarios para obtener datos del usuario
            const userData = await firstValueFrom(
              this.userClient.send('findOneUser', { id: candidate.user_id })
            );
            // Devolver el candidato con los datos del usuario agregados
            return {
              data: {
                ...candidate,
                user_names: userData ? userData.data.names : null,
                user_surnames: userData ? userData.data.surnames : null,
                user_numdoc: userData ? userData.data.document : null,
              },
              meta: dataGroup.meta,
            };
          } catch (error) {
            throw new RpcException('Error obteniendo datos del usuario');
          }
        }
  
        // Si no tiene user_id, devolver el candidato sin modificaciones
        return {
          ...candidate,
          user_names: null,
          user_surnames: null,
        };
      })
    );
  
    // Devolver el grupo de candidatos con los nombres de usuario procesados
    return {
      data: {
        ...dataGroup.data, // Tomar todos los datos de dataGroup.data
        candidates: processedData, // Candidatos procesados con los datos de usuario
      },
      meta: dataGroup.meta, // Si existe meta en tu respuesta original
    };
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
