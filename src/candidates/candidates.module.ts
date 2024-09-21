import { Module } from '@nestjs/common';

import { CandidatesController } from './candidates.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CANDIDATES_SERVICE, envs } from 'src/config';

@Module({
  controllers: [CandidatesController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: CANDIDATES_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.candidatesMicroservicesHost,
          port: envs.candidatesMicroservicesPort
        }
        
      },
      
    ]),
  ]
})
export class CandidatesModule {}
