import { Module } from '@nestjs/common';

import { ElectionsController } from './elections.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ELECTIONS_SERVICE, envs ,USER_SERVICE} from 'src/config';

@Module({
  controllers: [ElectionsController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: ELECTIONS_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.electionsMicroservicesHost,
          port: envs.electionsicroservicesPort
        }
        
      },{
        name: USER_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.usersMicroservicesHost,
          port: envs.usersMicroservicesPort
        }
        
      },
      
    ]),
  ]
})
export class ElectionsModule {}
