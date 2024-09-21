import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChaptersModule } from './chapters/chapters.module';
import { VotingModule } from './voting/voting.module';
import { ElectionsModule } from './elections/elections.module';
import { SubElectionsModule } from './sub-elections/sub-elections.module';
import { CandidatesModule } from './candidates/candidates.module';
import { GroupCandidatesModule } from './group-candidates/group-candidates.module';
import { TypeCandidatesModule } from './type-candidates/type-candidates.module';
import { VoterAccessModule } from './voter_access/voter_access.module';

@Module({
  imports: [UsersModule, ChaptersModule, VotingModule, ElectionsModule, SubElectionsModule, CandidatesModule, GroupCandidatesModule, TypeCandidatesModule, VoterAccessModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
