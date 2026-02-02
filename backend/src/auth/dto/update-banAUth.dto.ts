import {  IsString, IsEmail,IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';


export class updatebanAuthdto {

    @IsBoolean()
    isBanned:boolean


}