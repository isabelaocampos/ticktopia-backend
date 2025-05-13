import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get("sales")
  @Auth(ValidRoles.admin)
  generateSalesReport() {
    return this.reportService.generateSalesReport();
  }

  @Get("ocupation")
  @Auth(ValidRoles.admin)
  generateOcupationReport() {
    return this.reportService.generateOcupationReport();
  }
}
