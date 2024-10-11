import { Module } from '@nestjs/common';
import { VoteStatusController } from './vote-status.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, VOTING_SERVICE } from 'src/config';

@Module({
  controllers: [VoteStatusController],
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
      
    ]),
  ]
})
export class VoteStatusModule {}
