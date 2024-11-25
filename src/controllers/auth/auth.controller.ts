import { Body, Controller, Get, Post, Request, Inject } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SchemaValidationPipe } from '../../resources/pipes/schema-validation.pipe';
import { ValidationRequestDto } from '../dtos/validation-request.dto';
import { ErrorRequestDto } from '../dtos/error-request.dto';
import { AuthResponse } from './models/auth.response';
import { AuthRequest } from './models/auth.request';
import { AuthService } from './auth.service';
import { AuthInfoResponse } from './models/auth-info.response';
import { AuthOrganizationRequest } from './models/auth-organization.request';
import { Public } from './auth.decorators';

@Controller('auth')
@ApiTags('auth')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
@ApiUnauthorizedResponse()
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse()
  @Public()
  token(@Body(new SchemaValidationPipe()) body: AuthRequest) {
    return this.authService.signIn(body.email);
  }

  @Post('organization')
  @ApiCreatedResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse()
  organizationToken(
    @Request() { user },
    @Body(new SchemaValidationPipe()) body: AuthOrganizationRequest,
  ) {
    return this.authService.signInOrganization(
      Number(user.userId),
      Number(body.organizationId),
    );
  }

  @Get('/info')
  @ApiCreatedResponse({ type: AuthInfoResponse })
  info(@Request() { user }) {
    return user;
  }
}
