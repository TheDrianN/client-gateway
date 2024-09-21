import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './create-candidate.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {

}
