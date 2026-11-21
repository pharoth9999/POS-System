import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DebtsService } from './debts.service.js';

@ApiTags('debts')
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}
}
