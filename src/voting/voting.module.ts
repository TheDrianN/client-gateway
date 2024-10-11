import { Module } from '@nestjs/common';

import { VotingController } from './voting.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CANDIDATES_SERVICE, ELECTIONS_SERVICE, envs, VOTING_SERVICE } from 'src/config';

@Module({
  controllers: [VotingController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: VOTING_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.votingMicroservicesHost,
          port: envs.votingMicroservicesPort
        }
        
      },
      {
        name: CANDIDATES_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.candidatesMicroservicesHost,
          port: envs.candidatesMicroservicesPort
        }
        
      }, {
        name: ELECTIONS_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.electionsMicroservicesHost,
          port: envs.electionsicroservicesPort
        }
        
      },
      
    ]),
  ]
})
export class VotingModule {}
