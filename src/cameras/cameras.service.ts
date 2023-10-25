import { Injectable } from '@nestjs/common';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CamerasService {
  constructor(private prisma: PrismaService) {}

  async create(createCameraDto: CreateCameraDto) {
    const { name, ip, customerId, isEnabled } = createCameraDto;

    // Check if the IP is valid
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ip)) {
      throw new Error('Invalid IP address');
    }

    // Check if the customer already has a camera with the same IP
    const existingCamera = await this.prisma.camera.findFirst({
      where: {
        customerId,
        ip,
      },
    });
    if (existingCamera) {
      throw new Error(
        'A camera with the same IP already exists for this customer',
      );
    }

    // Check if the camera is already associated with another customer
    const cameraWithSameIp = await this.prisma.camera.findFirst({
      where: {
        ip,
        NOT: {
          customerId: null,
        },
      },
    });
    if (cameraWithSameIp) {
      throw new Error(
        'This camera is already associated with another customer',
      );
    }

    return this.prisma.camera.create({
      data: {
        name,
        ip,
        customerId,
        isEnabled,
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

  findCamerasByCustomer(id: string) {
    return this.prisma.camera.findMany({
      where: {
        customerId: id,
      },
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
