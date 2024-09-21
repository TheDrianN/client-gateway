import { PartialType } from '@nestjs/mapped-types';
import { CreateElectionDto } from './create-election.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateElectionDto extends PartialType(CreateElectionDto) {
  
}
