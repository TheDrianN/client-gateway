import { Module } from '@nestjs/common';
import { GroupCandidatesController } from './group-candidates.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CANDIDATES_SERVICE, ELECTIONS_SERVICE, envs, USER_SERVICE } from 'src/config';

@Module({
  controllers: [GroupCandidatesController],
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
      {
        name: USER_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.usersMicroservicesHost,
          port: envs.usersMicroservicesPort
        }
      },{
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
export class GroupCandidatesModule {}
