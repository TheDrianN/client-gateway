import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    @Min(1)
    public chapter_id: number;

    @IsString()
    public document: string;

    @IsString()
    public password: string;

    @IsString()
    public status : string;

    @IsString()
    public rol: string;
    
    @IsString()
    public names: string;

    @IsString()
    public surnames: string;
    
    @IsString()
    @IsOptional()
    public phone: string;
    
    @IsString()
    public email: string;

    @IsString()
    @IsOptional()
    public address: string;


    @IsString()
    @IsOptional()
    public code_access:string;
}
