import { PartialType } from '@nestjs/mapped-types';
import { CreateSubElectionDto } from './create-sub-election.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateSubElectionDto extends PartialType(CreateSubElectionDto) {
 
}
