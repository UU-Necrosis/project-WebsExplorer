import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DirectoryService } from './directory.service';

@Controller('api/websites-saved')
export class WebsitesSavedController {
  constructor(
    private readonly directoryService: DirectoryService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  listWebsitesSaved(@Headers('authorization') authorization: string | undefined) {
    this.authService.resolveAdminFromHeader(authorization);
    return this.directoryService.listWebsitesSaved();
  }
}