import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';
import { Permissions } from '../auth.decorators';
import { ListPermissionDto } from './dto/list-permission.dto';
import { Permission } from './entities/permission.entity';

@Controller('permission')
@ApiTags('rbac')
@Permissions('admin')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
@ApiUnauthorizedResponse()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Permission })
  create(@Req() { user }, @Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto, +user.userId);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: '#/components/schemas/PaginableEntity',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Permission' },
        },
      },
    },
  })
  async findAll(@Query() query: ListPermissionDto) {
    return await this.permissionService.findAll(
      query.q,
      query.page,
      query.size,
    );
  }

  @Get(':id')
  @ApiCreatedResponse({ type: Permission })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Permission })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
