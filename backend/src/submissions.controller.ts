import { Body, Controller, Get, Headers, Param, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DirectoryService } from './directory.service';
import type { CreateSubmissionInput } from './directory.service';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(
    private readonly directoryService: DirectoryService,
    private readonly authService: AuthService,
  ) {}

  @Get('mine')
  listMySubmissions(@Headers('authorization') authorization: string | undefined) {
    const user = this.authService.resolveCustomerFromHeader(authorization);
    return this.directoryService.listSubmissionsForUser(user.id);
  }

  @Get('voting')
  listSubmissionsForClientVoting(@Headers('authorization') authorization: string | undefined) {
    const user = this.authService.resolveCustomerFromHeader(authorization);
    return this.directoryService.listSubmissionsForClientVoting(user.id);
  }

  @Get('cooldown')
  getSubmissionCooldown(@Headers('authorization') authorization: string | undefined) {
    const user = this.authService.resolveFromHeader(authorization);
    return this.directoryService.getSubmissionCooldown(user);
  }

  @Get()
  listSubmissions(@Headers('authorization') authorization: string | undefined) {
    this.authService.resolveAdminFromHeader(authorization);
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
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (kind !== 'admin' && kind !== 'client') {
      throw new BadRequestException('Vote kind must be admin or client.');
    }
    if (kind === 'admin') {
      const admin = this.authService.resolveAdminFromHeader(authorization);
      return this.directoryService.recordVote(id, 'admin', admin.adminId);
    }
    const customer = this.authService.resolveCustomerFromHeader(authorization);
    return this.directoryService.recordVote(id, 'client', customer.id);
  }
}