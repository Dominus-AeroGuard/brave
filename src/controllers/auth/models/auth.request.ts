import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRequest {
  @ApiProperty({
    example: 'jonh@example.com',
    description: 'Email cadastrado no SIGA',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
