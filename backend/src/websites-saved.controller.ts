import { Controller, Get } from '@nestjs/common';
import { DirectoryService } from './directory.service';

@Controller('api/websites-saved')
export class WebsitesSavedController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  listWebsitesSaved() {
    return this.directoryService.listWebsitesSaved();
  }
}