import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth.decorators';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';
import { UserRole } from './entities/user-role.entity';

@Controller('user/:id/role')
@ApiTags('rbac')
@Roles('admin')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
@ApiUnauthorizedResponse()
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Array<UserRole> })
  create(
    @Param('id') id: string,
    @Body() createUserRoleDto: CreateUserRoleDto,
    @Req() { user },
  ) {
    return this.userRoleService.create(+id, createUserRoleDto, +user.userId);
  }

  @Get()
  @ApiCreatedResponse({ type: Array<UserRole> })
  findAll(@Param('id') id: string) {
    return this.userRoleService.findAll(+id);
  }

  @Get(':role_id')
  @ApiCreatedResponse({ type: UserRole })
  findOne(@Param('id') id: string, @Param('role_id') roleid: string) {
    return this.userRoleService.findOne(+id, +roleid);
  }

  @Delete(':role_id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Param('role_id') roleid: string) {
    return this.userRoleService.remove(+id, +roleid);
  }
}
