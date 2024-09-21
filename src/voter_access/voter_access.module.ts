import { Module } from '@nestjs/common';
import { VoterAccessController } from './voter_access.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, VOTER_ACCESS_SERVICE } from 'src/config';

@Module({
  controllers: [VoterAccessController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: VOTER_ACCESS_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.voteraccessMicroservicesHost,
          port: envs.voteraccessMicroservicesPort
        }
        
      },
      
    ]),
  ]
})
export class VoterAccessModule {}
