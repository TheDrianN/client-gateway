import { Module } from '@nestjs/common';
import { TypeCandidatesController } from './type-candidates.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CANDIDATES_SERVICE, envs } from 'src/config';

@Module({
  controllers: [TypeCandidatesController],
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
export class TypeCandidatesModule {}
