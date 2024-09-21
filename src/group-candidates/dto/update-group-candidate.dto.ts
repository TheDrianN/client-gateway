import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupCandidateDto } from './create-group-candidate.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateGroupCandidateDto extends PartialType(CreateGroupCandidateDto) {

}
