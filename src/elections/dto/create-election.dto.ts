import { IsDateString, IsString } from "class-validator";

export class CreateElectionDto {
    @IsString()
    public title: string;
    @IsString()
    public description: string;
    @IsDateString()
    public start_date: Date;
    @IsDateString()
    public end_date: Date;
    @IsString()
    public status: string;
}
