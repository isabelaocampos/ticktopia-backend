import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GcpService } from './gcp.service';

@Controller('gcp')
export class GcpController {
  constructor(private readonly gcpService: GcpService) { }

  @Get()
  turnOnVm() {
    return this.gcpService.turnVmOn("thinking-land-459213-k5", "us-central1-c","instance-20250520-135848");
  }


}
