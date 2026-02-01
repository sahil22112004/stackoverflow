import { IsEnum, IsUUID } from 'class-validator'

export enum VoteStatus {
  upvote = 'upvote',
  downvote = 'downvote',
}

export enum VoteTargetType {
  question = 'question',
  answer = 'answer',
}

export class CreateVoteDto {
  @IsUUID()
  targetId: string

  @IsEnum(VoteTargetType)
  targetType: VoteTargetType

  @IsUUID()
  userId: string

  @IsEnum(VoteStatus)
  status: VoteStatus
}
