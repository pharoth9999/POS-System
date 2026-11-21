import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnitsService } from './units.service.js';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}
}
