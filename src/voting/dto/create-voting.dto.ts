import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateVotingDto {
    @IsNumber()
    @Min(1) 
    public sub_election_id: number;

    @IsNumber()
    @Min(1)
    public user_id: number;

    @IsNumber()
    @Min(1)
    @IsOptional()
    public group_candidates_id: number;

    @IsString()
    public vote_type: string;
}
