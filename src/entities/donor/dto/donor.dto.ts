import { IsNumber, IsString } from "class-validator";

export class DonorRequestDto {
    @IsString()
    address!: string;

    @IsNumber()
    age!: number;

    @IsString()
    age_unit!: string;

    @IsString()
    city!: string;

    @IsString()
    dob!: string;

    @IsString()
    gender!: string;

    @IsString()
    mobile_number: string;

    @IsString()
    name: string;
    
    @IsString()
    patient_test_id: string

}