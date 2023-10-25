import { Test, TestingModule } from '@nestjs/testing';
import { CamerasService } from './cameras.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCameraDto } from './dto/create-camera.dto';

describe('CamerasService', () => {
  let service: CamerasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CamerasService],
    }).compile();

    service = module.get<CamerasService>(CamerasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('CamerasService', () => {
  let service: CamerasService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CamerasService, PrismaService],
    }).compile();

    service = module.get<CamerasService>(CamerasService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up the test data
    await prismaService.camera.deleteMany({});
  });

  describe('create', () => {
    it('should create a camera', async () => {
      const createCameraDto: CreateCameraDto = {
        name: 'Test Camera',
        ip: '192.168.1.100',
        customerId: '1',
        isEnabled: true,
      };

      const camera = await service.create(createCameraDto);

      expect(camera).toHaveProperty('id');
      expect(camera.name).toEqual(createCameraDto.name);
      expect(camera.ip).toEqual(createCameraDto.ip);
      expect(camera.customerId).toEqual(createCameraDto.customerId);
      expect(camera.isEnabled).toEqual(createCameraDto.isEnabled);
    });

    it('should throw an error if the IP address is invalid', async () => {
      const createCameraDto: CreateCameraDto = {
        name: 'Test Camera',
        ip: 'invalid-ip-address',
        customerId: '1',
        isEnabled: true,
      };

      await expect(service.create(createCameraDto)).rejects.toThrow(
        'Invalid IP address',
      );
    });

    it('should throw an error if a camera with the same IP address already exists for the customer', async () => {
      const createCameraDto1: CreateCameraDto = {
        name: 'Test Camera 1',
        ip: '192.168.1.100',
        customerId: '1',
        isEnabled: true,
      };

      const createCameraDto2: CreateCameraDto = {
        name: 'Test Camera 2',
        ip: '192.168.1.100',
        customerId: '1',
        isEnabled: true,
      };

      await service.create(createCameraDto1);

      await expect(service.create(createCameraDto2)).rejects.toThrow(
        'A camera with the same IP already exists for this customer',
      );
    });
  });
});
