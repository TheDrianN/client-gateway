import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteStatusDto } from './create-vote-status.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateVoteStatusDto extends PartialType(CreateVoteStatusDto) {

}
