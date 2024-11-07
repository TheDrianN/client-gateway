import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    document: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(9)
    password: string;

    @IsString()
    @IsOptional()
    code_access:string;
}
