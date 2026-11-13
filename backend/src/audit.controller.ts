import { Controller, Get, Headers, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditService } from './audit.service';

@Controller('api/audit-logs')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly authService: AuthService,
  ) {}

  @Get('verify')
  verify(@Headers('authorization') authorization: string | undefined) {
    this.authService.resolveAdminFromHeader(authorization);
    return this.auditService.verify();
  }

  @Get()
  list(
    @Headers('authorization') authorization: string | undefined,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    this.authService.resolveAdminFromHeader(authorization);
    return this.auditService.list(limit, type);
  }
}
