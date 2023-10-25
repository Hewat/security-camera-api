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
import { CamerasService } from './cameras.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @Post()
  create(@Body() createCameraDto: CreateCameraDto) {
    return this.camerasService.create(createCameraDto);
  }

  @Get()
  findAll(@Query('isEnabled') isEnabled?: string | boolean) {
    const isEnabledBoolean =
      isEnabled === 'true' ? true : isEnabled === 'false' ? false : undefined;
    if (isEnabledBoolean !== undefined) {
      return this.camerasService.findByIsEnabled(isEnabledBoolean);
    } else {
      return this.camerasService.findAll();
    }
  }

  @Get('/findCamerasByCustomer/:id')
  findCamerasByCustomer(@Param('id') id: string) {
    return this.camerasService.findCamerasByCustomer(id);
  }

  @Get(':camera_id')
  findOne(@Param('camera_id') id: string) {
    return this.camerasService.findOne(id);
  }

  @Patch(':camera_id')
  update(
    @Param('camera_id') id: string,
    @Body() updateCameraDto: UpdateCameraDto,
  ) {
    return this.camerasService.update(id, updateCameraDto);
  }

  @Patch('/activateCamera/:camera_id')
  activateCamera(@Param('camera_id') id: string) {
    return this.camerasService.activateCamera(id);
  }

  @Patch('/deactivateCamera/:camera_id')
  deactivateCamera(@Param('camera_id') id: string) {
    return this.camerasService.deactivateCamera(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.camerasService.remove(id);
  }
}
