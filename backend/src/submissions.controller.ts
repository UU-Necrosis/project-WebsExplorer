import { Body, Controller, Get, Param, Post, BadRequestException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DirectoryService } from './directory.service';
import type { CreateSubmissionInput, VoteKind } from './directory.service';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(
    private readonly directoryService: DirectoryService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  listSubmissions() {
    return this.directoryService.listSubmissions();
  }

  @Post()
  createSubmission(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateSubmissionInput,
  ) {
    const user = this.authService.resolveFromHeader(authorization);
    return this.directoryService.createSubmission(body, user);
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