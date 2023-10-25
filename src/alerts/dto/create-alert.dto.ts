import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  occurredAt: Date;
  cameraId: string;
}
