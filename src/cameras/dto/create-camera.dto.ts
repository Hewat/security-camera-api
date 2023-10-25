import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCameraDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsBoolean()
  @IsNotEmpty()
  isEnabled: boolean;

  customerId: string;
}
