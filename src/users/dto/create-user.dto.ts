import { IsNumber, IsOptional, IsString, Min,IsDate } from "class-validator";
import { Transform } from 'class-transformer';

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

    @IsDate()
    @Transform(({ value }) => new Date(value))
    public date_of_birth: Date;

    @IsString()
    @IsOptional()
    public code_access:string;
}
