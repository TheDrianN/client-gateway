import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateGroupCandidateDto {
    @IsNumber()
    @Min(1)
    public sub_election_id: number;
    @IsString()
    public number_list: string;
    @IsOptional()
    public img: Buffer;
}
