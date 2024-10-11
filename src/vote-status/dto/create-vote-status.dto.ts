import { IsNumber, IsString, IsPositive,IsDateString } from "class-validator";

export class CreateVoteStatusDto {
    @IsNumber()
    @IsPositive()
    users_id: number;
  
    @IsNumber()
    @IsPositive() 
    elections_id: number;
  
    @IsString() 
    status: string;
  
    @IsString()
    browser: string;
  
    @IsString()
    latitud: string;
  
    @IsString()
    longitud: string;
  
    @IsDateString()
    datevote: Date;
  
}
