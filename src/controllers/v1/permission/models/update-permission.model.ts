import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermitionActionEnum } from 'src/domain/enums/permission-action.enum';

export class UpdatePermissionRequest {
  @ApiProperty({
    example: 1,
    description: 'Id da permissão',
  })
  @IsNotEmpty()
  @IsInt()
  permissionId: number;

  @ApiProperty({
    example: 'application',
    description: 'Resource controlado pela permissão',
  })
  @IsNotEmpty()
  resource: string;

  @ApiProperty({
    example: 'write',
    enum: Object.values(PermitionActionEnum),
    description: 'Ação permitida sobre o resource controlado pela permissão',
  })
  @IsNotEmpty()
  @IsIn(Object.values(PermitionActionEnum).map((v) => v.toString()))
  action: string;

  @ApiProperty({
    example: 'application',
    description: 'Descrição da permissão',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'User_id que criou / editou a permissão',
  })
  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
