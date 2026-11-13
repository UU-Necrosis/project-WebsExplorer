import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import type { CreateSubmissionInput, VoteKind } from './directory.service';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  listSubmissions() {
    return this.directoryService.listSubmissions();
  }

  @Post()
  createSubmission(@Body() body: CreateSubmissionInput) {
    return this.directoryService.createSubmission(body);
  }

  @Post(':id/votes/:kind')
  recordVote(
    @Param('id') id: string,
    @Param('kind') kind: string,
    @Body() body: { voterId?: number },
  ) {
    if (kind !== 'admin' && kind !== 'client') {
      throw new BadRequestException('Vote kind must be admin or client.');
    }
    const voterId = Number(body?.voterId);
    if (!Number.isInteger(voterId) || voterId < 1) {
      throw new BadRequestException('A positive numeric voterId is required.');
    }
    return this.directoryService.recordVote(id, kind as VoteKind, voterId);
  }
}