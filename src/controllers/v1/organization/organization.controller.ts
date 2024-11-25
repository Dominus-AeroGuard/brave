import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Inject,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserOrganizationRequest } from './models/create-user-organization.model';
import { SchemaValidationPipe } from '../../../resources/pipes/schema-validation.pipe';
import { CreateUserOrganizationUseCase } from '../../../domain/use-cases/organization/create-user-organization.use-case';
import { UserOrganizationRepository } from '../../../resources/infra/prisma/repositories/user-organization.repository';
import { ListOrganizationUserUseCase } from '../../../domain/use-cases/organization/list-organization-user.use-case';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserOrganization } from '../../../domain/entities';
import { PaginableEntity } from '../../dtos/paginable.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';

@ApiTags('organizations')
@Controller('v1/organizations')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class OrganizationController {
  constructor(
    @Inject(CreateUserOrganizationUseCase)
    private readonly createUserOrganization: CreateUserOrganizationUseCase,
    @Inject(ListOrganizationUserUseCase)
    private readonly listOrganizationUser: ListOrganizationUserUseCase,
    @Inject(UserOrganizationRepository)
    private readonly userOrganizationRepository: UserOrganizationRepository,
  ) {}

  @Post('/users')
  @ApiCreatedResponse({ type: UserOrganization })
  @ApiUnprocessableEntityResponse({ type: ErrorRequestDto })
  create(
    @Request() req,
    @Body(new SchemaValidationPipe())
    userOrganization: CreateUserOrganizationRequest,
  ) {
    return this.createUserOrganization.execute({
      ...userOrganization,
      organization: { id: req.user.organizationId },
      user: { id: req.user.userId },
    });
  }

  @Get('/users')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: '#/components/schemas/PaginableEntity',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserOrganization' },
        },
      },
    },
  })
  findAll(
    @Request() { user },
    @Query() query: any,
  ): Promise<PaginableEntity<UserOrganization>> {
    return this.listOrganizationUser.execute({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      organizationId: user.organizationId,
    });
  }

  @Get('/users/:id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: UserOrganization })
  findOne(@Request() { user }, @Param('id') id: number) {
    return this.userOrganizationRepository.findOne(user.organizationId, +id);
  }

  @Delete('/users/:id')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() { user }, @Param('id') id: string) {
    await this.userOrganizationRepository.remove({
      user_id: +id,
      organization: { id: user.organizationId },
      user: { id: user.userId },
    });
  }
}
