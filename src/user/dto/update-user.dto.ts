import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, MinLength, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
