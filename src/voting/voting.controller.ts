import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CANDIDATES_SERVICE, ELECTIONS_SERVICE, VOTING_SERVICE } from 'src/config';
import { CreateVotingDto } from './dto/create-voting.dto';
import { catchError, firstValueFrom } from 'rxjs';


@Controller('voting')
export class VotingController {
  constructor(
    @Inject(VOTING_SERVICE) private readonly votingClient: ClientProxy,
    @Inject(CANDIDATES_SERVICE) private readonly candidatesClient: ClientProxy,
    @Inject(ELECTIONS_SERVICE) private readonly electionClient: ClientProxy,

  ) {}

  @Post()
  createVoting(@Body() createVotingDto:CreateVotingDto){
    return this.votingClient.send('createVoting',createVotingDto).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get()
  findAllVoting(){
    
    return this.votingClient.send('findAllVoting',{}).pipe(
      catchError(err => {throw new RpcException(err)})
    );
  }

  @Get(':id')
  async findOneVoting(@Param('id') id: string) {
    try {
      // Paso 1: Obtener los datos de votación
      const votingData = await firstValueFrom(
        this.votingClient.send('findOneVoting', { id }).pipe(
          catchError(err => { throw new RpcException(err); })
        )
      );
  

  
      // Obtener un candidate_id de los votos para luego buscar el estado de votación
      const firstVoteStatusId = votingData.data[0]?.voteStatusId;

  
      // Paso 3: Obtener los detalles del estado de votación
      const voteStatusData = await firstValueFrom(
        this.votingClient.send('findOneVoteStatus', { id: firstVoteStatusId }).pipe(
          catchError(err => { throw new RpcException(err); })
        )
      );

  
      // Paso 4: Obtener los detalles de la elección
      const electionId = voteStatusData.data.elections_id;
      const electionData = await firstValueFrom(
        this.electionClient.send('findOneElection', { id: electionId }).pipe(
          catchError(err => { throw new RpcException(err); })
        )
      );
     
  
      // Obtener el número de electores hábiles
      const electoresHabiles = electionData.data.number_voters;
  
 
  
      // Paso 5: Procesar los datos y armar el reporte
      const votosEmitidos = votingData.data.length;
      let votosBlancos = 0;
      const conteoVotos: { [key: string]: number } = {};
  
      // Contar los votos por grupo y contar votos en blanco
      votingData.data.forEach(vote => {
        const groupCandidatesId = vote.groupCandidatesId;
        

        if (groupCandidatesId === "0") { // Si es un voto en blanco
          votosBlancos++;
        } else {
          if (!conteoVotos[groupCandidatesId]) {
            conteoVotos[groupCandidatesId] = 0;
          }
          conteoVotos[groupCandidatesId]++;
        }
      });
     


      // Obtener los datos de los grupos de candidatos
      const groupCandidatesData = await Promise.all(
        Object.keys(conteoVotos).map(async (groupCandidatesId) => {
          return firstValueFrom(
            this.candidatesClient.send('findOneGroupCandidate', { id: groupCandidatesId }).pipe(
              catchError(err => { throw new RpcException(err); })
            )
          );
        })
      );

      // Generar los datos de los candidatos con sus porcentajes
      const candidatos = Object.keys(conteoVotos).map((groupCandidatesId, index) => {
        const votos = conteoVotos[groupCandidatesId];
        const porcentaje = ((votos / votosEmitidos) * 100).toFixed(2);
  
        // Obtener el número de lista del grupo de candidatos
        const groupCandidate = groupCandidatesData[index].data; // Acceder al objeto `data`
        const numeroLista = groupCandidate ? groupCandidate.number_list : "Desconocido";
  
        return {
          nombre: `Lista número ${numeroLista}`,
          numeroLista: parseInt(numeroLista),
          votos: votos,
          porcentaje: parseFloat(porcentaje),
        };
      });
  
      // Calcular el porcentaje de participación
      const porcentajeParticipacion = ((votosEmitidos / electoresHabiles) * 100).toFixed(2);
  
      // Agregar los votos en blanco como un "candidato"
      const porcentajeBlancos = ((votosBlancos / votosEmitidos) * 100).toFixed(2);
      candidatos.push({
        nombre: 'Voto en Blanco',
        numeroLista: 0,
        votos: votosBlancos,
        porcentaje: parseFloat(porcentajeBlancos),
      });
  
      // Armar el reporte final
      const reporte = {
        electoresHabiles: electoresHabiles,
        participacionMiembros: votosEmitidos,
        porcentajeParticipacion: porcentajeParticipacion + '%',
        candidatos: candidatos,
        votosBlancos: votosBlancos,
        votosEmitidos: votosEmitidos,
      };
  
      // Retornar el resultado
      return {
        data: reporte,
        status: HttpStatus.ACCEPTED,
      };
  
    } catch (error) {
      throw new RpcException(error);
    }
  }
  

}
