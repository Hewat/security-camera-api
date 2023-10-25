import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  create(createAlertDto: CreateAlertDto) {
    return this.prisma.alerts.create({
      data: {
        ocurredAt: createAlertDto.occurredAt,
        cameraId: createAlertDto.cameraId,
      },
    });
  }

  findAll() {
    return this.prisma.alerts.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        camera: true,
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
