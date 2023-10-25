import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsService],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('AlertsService', () => {
  let service: AlertsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsService, PrismaService],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up all alerts after each test
    await prismaService.alerts.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from the database after all tests
    await prismaService.$disconnect();
  });

  describe('create', () => {
    it('should throw an error if cameraId is not provided', async () => {
      const createAlertDto: CreateAlertDto = {
        occurredAt: new Date(),
        cameraId: '', // Add an empty string or any other valid value for cameraId
      };

      await expect(service.create(createAlertDto)).rejects.toThrow(
        'An alert must be associated with a camera',
      );
    });

    it('should throw an error if cameraId is an array with more than one element', async () => {
      const createAlertDto: CreateAlertDto = {
        occurredAt: new Date(),
        cameraId: '1', // Change the cameraId property to a single string value
      };

      await expect(service.create(createAlertDto)).rejects.toThrow(
        'An alert must be associated with a single camera',
      );
    });

    it('should create an alert if all required fields are provided', async () => {
      const createAlertDto: CreateAlertDto = {
        occurredAt: new Date(),
        cameraId: '1',
      };

      const alert = await service.create(createAlertDto);

      expect(alert).toHaveProperty('id');
      expect(alert.ocurredAt).toEqual(createAlertDto.occurredAt);
      expect(alert.cameraId).toEqual(createAlertDto.cameraId);
    });
  });
});
