import { Controller, Post, Body } from '@nestjs/common'
import { VotesService } from './votes.service'
import { CreateVoteDto } from './dto/create-vote.dto'

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  vote(@Body() dto: CreateVoteDto) {
    return this.votesService.vote(dto)
  }
}
