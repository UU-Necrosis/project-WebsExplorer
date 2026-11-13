import { Body, Controller, Get, Headers, Post, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import type { NodeHeartbeatInput } from './directory.service';

@Controller('api/nodes')
export class NodesController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  listNodes() {
    return this.directoryService.listNodes();
  }

  @Post('heartbeat')
  heartbeat(
    @Headers('x-node-token') token: string | undefined,
    @Body() body: NodeHeartbeatInput,
  ) {
    const registrationToken = process.env.NODE_REGISTRATION_TOKEN;
    if (!registrationToken) {
      throw new ServiceUnavailableException('Node registration is not configured.');
    }
    if (token !== registrationToken) {
      throw new UnauthorizedException('Invalid node registration token.');
    }
    return this.directoryService.registerNode(body);
  }
}