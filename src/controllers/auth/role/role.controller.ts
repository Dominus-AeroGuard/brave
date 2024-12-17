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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';
import { Roles } from '../auth.decorators';
import { ListRoleDto } from './dto/list-role.dto';
import { Role } from './entities/role.entity';

@Controller('role')
@ApiTags('rbac')
@Roles('admin')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
@ApiUnauthorizedResponse()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Role })
  create(@Req() { user }, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto, +user.userId);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: '#/components/schemas/PaginableEntity',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Role' },
        },
      },
    },
  })
  async findAll(@Query() query: ListRoleDto) {
    return await this.roleService.findAll(query.q, query.page, query.size);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: Role })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Role })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
