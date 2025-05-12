import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get("sales")
  @Auth(ValidRoles.admin)
  create() {
    return this.reportService.generateSalesReport();
  }

  @Get("ocupation")
  @Auth(ValidRoles.admin)
  findAll() {
    return this.reportService.generateOcupationReport();
  }
}
