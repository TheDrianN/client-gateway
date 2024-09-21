import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeCandidateDto } from './create-type-candidate.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateTypeCandidateDto extends PartialType(CreateTypeCandidateDto) {

}
