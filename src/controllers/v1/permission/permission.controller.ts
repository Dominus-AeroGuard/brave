import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Inject,
  Query,
} from '@nestjs/common';
import { CreatePermissionRequest } from './models/create-permission.model';
import { JwtAuthGuard } from '../../../resources/auth/auth.guard';
import { SchemaValidationPipe } from '../../../resources/pipes/schema-validation.pipe';
import { CreatePermissionUseCase } from '../../../domain/use-cases/permission/create-permission.use-case';
//import { UpdatePermissionUseCase } from '../../../domain/use-cases/permission/update-permission.use-case';
import { PermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';
import { ListPermissionUseCase } from '../../../domain/use-cases/permission/list-permission.use-case';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Permission } from '../../../domain/entities';
import { PaginableEntity } from '../../dtos/paginable.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';

@ApiTags('permissions')
@Controller('v1/permissions')
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class PermissionController {
  constructor(
    @Inject(CreatePermissionUseCase)
    private readonly createPermission: CreatePermissionUseCase,
    //@Inject(UpdatePermissionUseCase)
    //private readonly updatePermission: UpdatePermissionUseCase,
    @Inject(ListPermissionUseCase)
    private readonly listPermission: ListPermissionUseCase,
    @Inject(PermissionRepository)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Permission })
  @ApiUnprocessableEntityResponse({ type: ErrorRequestDto })
  create(
    @Request() req,
    @Body(new SchemaValidationPipe())
    Permission: CreatePermissionRequest,
  ) {
    return this.createPermission.execute(Permission);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
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
  findAll(
    @Request() { permission },
    @Query() query: any,
  ): Promise<PaginableEntity<Permission>> {
    return this.listPermission.execute({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      permissionId: permission.permissionId,
    });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: Permission })
  findOne(@Request() { permission }) {
    return this.permissionRepository.findOne(permission.permissionId);
  }
}