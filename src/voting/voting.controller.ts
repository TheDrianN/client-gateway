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
      const subelectionId = id;
  
      // Paso 5: Obtener todos los candidatos de la elección
      const allCandidates = await firstValueFrom(
        this.candidatesClient.send('findAllCandidatesSubElection', { id: subelectionId }).pipe(
          catchError(err => { throw new RpcException(err); })
        )
      );
    
      // Inicializar el conteo de votos por cada candidato
      const conteoVotos: { [key: string]: number } = {};
      let votosEmitidos = votingData.data.length;
      let votosBlancos = 0;
  
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
    
      // Paso 6: Generar los datos de los candidatos con sus porcentajes
      const candidatos = allCandidates.data.map(candidate => {
        const votos = conteoVotos[candidate.id] || 0; // Si no hay votos, asigna 0
        const porcentaje = votosEmitidos > 0 ? ((votos / votosEmitidos) * 100).toFixed(2) : '0.00';
  
        return {
          nombre: `Lista número ${candidate.number_list}`,
          numeroLista: parseInt(candidate.number_list),
          img: candidate.img,
          votos: votos,
          porcentaje: parseFloat(porcentaje),
        };
      });
    
      // Calcular el porcentaje de participación
      const porcentajeParticipacion = ((votosEmitidos / electoresHabiles) * 100).toFixed(2);
  
      // Agregar los votos en blanco como un "candidato"
      const porcentajeBlancos = votosEmitidos > 0 ? ((votosBlancos / votosEmitidos) * 100).toFixed(2) : '0.00';
      candidatos.push({
        nombre: 'Voto en Blanco',
        numeroLista: 0,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzQE9elUihagv-Nj3IllH1VhRu50OgOJEkXg&s",
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
