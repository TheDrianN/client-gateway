import { IsString } from "class-validator";

export class CreateTypeCandidateDto {
    @IsString()
    public name_type: string;
    @IsString()
    public description: string;
    @IsString()
    public type: string;
}
