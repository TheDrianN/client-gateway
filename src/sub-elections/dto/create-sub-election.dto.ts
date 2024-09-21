import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateSubElectionDto {
    @IsNumber()
    @Min(1)
    @Type(()=> Number)
    public election_id: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    public chapter_id: number;

    @IsString()
    public title: string;

    @IsString()
    @IsOptional()
    public description: string;
}
