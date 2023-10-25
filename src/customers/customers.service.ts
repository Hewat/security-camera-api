import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: createCustomerDto.name,
      },
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        cameras: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.customer.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        cameras: true,
      },
    });
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        name: updateCustomerDto.name,
      },
    });
  }

  remove(id: string) {
    return this.prisma.customer.delete({
      where: {
        id: id,
      },
    });
  }
}
