import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateVoterAccessDto {
    @IsNumber()
    @IsPositive()
    public users_id: number;

    @IsNumber()
    @IsPositive()
    public sub_elections_id:number;

    @IsString()
    public can_vote: string;
}
