import { Injectable } from '@nestjs/common';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CamerasService {
  constructor(private prisma: PrismaService) {}

  create(createCameraDto: CreateCameraDto) {
    return this.prisma.camera.create({
      data: {
        name: createCameraDto.name,
        ip: createCameraDto.ip,
        customerId: createCameraDto.customerId,
        isEnabled: createCameraDto.isEnabled,
      },
    });
  }

  findAll() {
    return this.prisma.camera.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        alerts: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.camera.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        alerts: true,
      },
    });
  }

  update(id: string, updateCameraDto: UpdateCameraDto) {
    return this.prisma.camera.update({
      where: {
        id: id,
      },
      data: {
        name: updateCameraDto.name,
        ip: updateCameraDto.ip,
        customerId: updateCameraDto.customerId,
        isEnabled: updateCameraDto.isEnabled,
      },
    });
  }

  async activateCamera(id: string) {
    const camera = await this.findOne(id);
    if (camera.isEnabled) {
      console.log(`Camera ${id} is already enabled`);
      return;
    }
    console.log(`Activating camera ${id}`);
    return this.update(id, { isEnabled: true });
  }

  async deactivateCamera(id: string) {
    const camera = await this.findOne(id);
    if (!camera.isEnabled) {
      console.log(`Camera ${id} is already disabled`);
      return;
    }
    console.log(`Deactivating camera ${id}`);
    return this.update(id, { isEnabled: false });
  }

  remove(id: string) {
    return this.prisma.camera.delete({
      where: {
        id: id,
      },
    });
  }
}
