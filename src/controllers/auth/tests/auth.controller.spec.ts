import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from '../models/auth.request';
import { AuthOrganizationRequest } from '../models/auth-organization.request';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signInOrganization: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('token', () => {
    it('should return an AuthResponse when signIn is successful', async () => {
      const mockAuthResponse = {
        access_token: 'mock_token',
        token_type: 'Bearer',
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockAuthResponse);

      const body: AuthRequest = { email: 'test@example.com' };

      const result = await authController.token(body);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.signIn).toHaveBeenCalledWith(body.email);
    });

    it('should throw UnauthorizedException if signIn fails', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException());

      const body: AuthRequest = { email: 'invalid@example.com' };

      await expect(authController.token(body)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('organizationToken', () => {
    it('should return an AuthResponse when signInOrganization is successful', async () => {
      const mockAuthResponse = {
        access_token: 'mock_token',
        token_type: 'Bearer',
      };
      jest
        .spyOn(authService, 'signInOrganization')
        .mockResolvedValue(mockAuthResponse);

      const user = { userId: 1 };
      const body: AuthOrganizationRequest = { organizationId: 1 };

      const result = await authController.organizationToken({ user }, body);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.signInOrganization).toHaveBeenCalledWith(
        user.userId,
        body.organizationId,
      );
    });

    it('should throw UnauthorizedException if signInOrganization fails', async () => {
      jest
        .spyOn(authService, 'signInOrganization')
        .mockRejectedValue(new UnauthorizedException());

      const user = { userId: 1 };
      const body: AuthOrganizationRequest = { organizationId: 1 };

      await expect(
        authController.organizationToken({ user }, body),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('info', () => {
    it('should return user information', () => {
      const user = { userId: 1, email: 'test@example.com' };

      const result = authController.info({ user });

      expect(result).toEqual(user);
    });
  });
});
