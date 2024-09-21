import { PartialType } from '@nestjs/mapped-types';
import { CreateVotingDto } from './create-voting.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateVotingDto extends PartialType(CreateVotingDto) {

}
