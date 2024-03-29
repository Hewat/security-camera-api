import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { isArray } from 'class-validator';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  create(createAlertDto: CreateAlertDto) {
    if (!createAlertDto.cameraId) {
      throw new Error('An alert must be associated with a camera');
    }

    if (isArray(createAlertDto) && createAlertDto.cameraId.length > 1) {
      console.log(createAlertDto.cameraId.length);
      throw new Error('An alert must be associated with a single camera');
    }
    return this.prisma.alerts.create({
      data: {
        ocurredAt: createAlertDto.occurredAt,
        cameraId: createAlertDto.cameraId,
      },
    });
  }

  async findAll(query: any) {
    const alerts = await this.prisma.alerts.findMany({
      where: {
        camera: {
          customerId: query.customerId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return alerts;
  }

  async findAlertsByDateInterval(startDate: Date, endDate: Date) {
    const startDateString = new Date(startDate).toISOString();
    const endDateString = new Date(endDate).toISOString();

    return await this.prisma.alerts.findMany({
      where: {
        ocurredAt: {
          gte: startDateString,
          lte: endDateString,
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.alerts.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        camera: true,
      },
    });
  }

  update(id: string, updateAlertDto: UpdateAlertDto) {
    return this.prisma.alerts.update({
      where: {
        id: id,
      },
      data: {
        ocurredAt: updateAlertDto.occurredAt,
        cameraId: updateAlertDto.cameraId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.alerts.delete({
      where: {
        id: id,
      },
    });
  }
}
