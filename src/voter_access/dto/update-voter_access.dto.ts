import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterAccessDto } from './create-voter_access.dto';

export class UpdateVoterAccessDto extends PartialType(CreateVoterAccessDto) {
  id: number;
}
