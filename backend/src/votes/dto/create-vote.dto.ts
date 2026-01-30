export class CreateVoteDto {}
import {  IsString, IsEmail,IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

enum VoteStatus {
  upvote = 'upvote',
  downvote = 'downvote',
}


export class CreateAnswerDto {

    @IsString({message:'enter only string'})
    @IsOptional()
    questionId:string

    @IsEmail()
    @IsNotEmpty({message:'this field cannot be emty'})
    userId:string

    @IsEnum(VoteStatus)
    status:VoteStatus

    
}