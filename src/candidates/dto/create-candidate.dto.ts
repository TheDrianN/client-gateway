import { IsNumber, Min } from "class-validator";

export class CreateCandidateDto {
    @IsNumber()
    @Min(1)
    public type_candidate_id: number;
    @IsNumber()
    @Min(1)
    public group_candidate_id: number;
    @IsNumber()
    @Min(1)
    public user_id: number;
}
