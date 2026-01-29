import {  IsString, IsEmail,IsNotEmpty, IsOptional } from 'class-validator';


export class CreateAuthDto {

    @IsString({message:'enter only string'})
    @IsOptional()
    username:string

    @IsEmail()
    @IsNotEmpty({message:'this field cannot be emty'})
    email:string


}