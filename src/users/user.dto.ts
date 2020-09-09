import { IsString, IsOptional, IsEmail, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

class CreateUserDto {
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public firstName: string;

  @IsOptional()
  @IsString()
  public lastName: string;

  @IsDate()
  @Transform((value) => new Date(value))
  public birthDate: Date;

  @IsString()
  public icNumber: string;
}

export default CreateUserDto;
