import {  IsString, IsEmail,IsNotEmpty, IsOptional } from 'class-validator';


export class CreateAnswerDto {

    @IsString({message:'enter only string'})
    @IsOptional()
    questionId:string

    @IsString({message:'enter only string'})
    @IsNotEmpty({message:'this field cannot be emty'})
    userId:string

    @IsString({message:'enter only string'})
    @IsNotEmpty({message:'this field cannot be emty'})
    Answer:string


}
