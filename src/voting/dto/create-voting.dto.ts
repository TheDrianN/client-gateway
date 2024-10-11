import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateVotingDto {
    @IsNumber()
    @IsPositive() 
    public sub_election_id: number;

    @IsNumber()
    @IsPositive()
    public vote_status_id: number;

    @IsNumber()
    @Min(0)
    public group_candidates_id: number;

}
