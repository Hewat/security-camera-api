import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(createAlertDto);
  }

  @Get()
  findAll(
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    if (customerId) {
      // Filter alerts by customerId
      return this.alertsService.findAll({
        where: {
          customerId: customerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          camera: true,
        },
      });
    }
    if (startDate && endDate) {
      // Filter alerts by  date interval
      return this.findAlertsByDateInterval(startDate, endDate);
    }
    if (startDate && !endDate) {
      // Filter alerts by  date interval
      return this.findAlertsByDateInterval(startDate, new Date());
    }
    if (!startDate && !endDate) {
      // Filter alerts for the current day
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      );

      return this.findAlertsByDateInterval(startOfDay, endOfDay);
    }
    return this.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Post('/findAlertsByDateInterval')
  findAlertsByDateInterval(
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
  ) {
    return this.alertsService.findAlertsByDateInterval(startDate, endDate);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.update(id, updateAlertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
