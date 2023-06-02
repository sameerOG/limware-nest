import { IsString } from "class-validator";

export class FileManagerDto {
@IsString()
name!: string;

@IsString()
type!: string;

@IsString()
position!: string;

file: any
}