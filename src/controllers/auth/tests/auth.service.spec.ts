import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        authService.signIn('nonexistent@example.com'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a valid AuthResponse when user is found', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        name: 'Jonh Doe',
        document: 'string',
        status: '1',
        organizations: [
          {
            organization_id: 1,
            organization: {
              organization_id: 1,
              name: 'Org 1',
            },
          },
        ],
        userRoles: [
          {
            role: { role: 'admin' },
          },
        ],
        userPermissions: [
          {
            permission: { resource: 'user', action: 'read' },
          },
        ],
      };

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock_token');

      const result = await authService.signIn('test@example.com');

      expect(result).toEqual({
        access_token: 'mock_token',
        token_type: 'Bearer',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.user_id,
        email: mockUser.email,
        organizations: [{ id: 1, name: 'Org 1' }],
        roles: ['admin'],
        permissions: ['user:read'],
      });
    });
  });

  describe('signInOrganization', () => {
    it('should return a valid AuthResponse when user is found and organization is valid', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        organizations: [
          {
            organization: {
              organization_id: 1,
              name: 'Org 1',
            },
          },
        ],
        userRoles: [
          {
            role: {
              role: 'admin',
              rolePermissions: [
                {
                  permission: { resource: 'user', action: 'read' },
                },
              ],
            },
          },
        ],
        userPermissions: [
          {
            permission: { resource: 'user', action: 'create' },
          },
        ],
        userOrganizationPermissions: [
          {
            permission: { resource: 'org', action: 'update' },
          },
        ],
        userOrganizationRoles: [
          {
            role: {
              role: 'manager',
              rolePermissions: [
                {
                  permission: { resource: 'org', action: 'delete' },
                },
              ],
            },
          },
        ],
      };

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock_token');

      const result = await authService.signInOrganization(1, 1);

      expect(result).toEqual({
        access_token: 'mock_token',
        token_type: 'Bearer',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.user_id,
        orgId: 1,
        email: mockUser.email,
        organizations: [{ id: 1, name: 'Org 1' }],
        roles: ['admin', 'manager'],
        permissions: ['user:create', 'org:update', 'user:read', 'org:delete'],
      });
    });

    it('should throw ForbiddenException when user does not have access on organization', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        organizations: [
          {
            organization: {
              organization_id: 1,
              name: 'Org 1',
            },
          },
        ],
        userRoles: [
          {
            role: {
              role: 'admin',
              rolePermissions: [
                {
                  permission: { resource: 'user', action: 'read' },
                },
              ],
            },
          },
        ],
        userPermissions: [
          {
            permission: { resource: 'user', action: 'create' },
          },
        ],
        userOrganizationPermissions: [
          {
            permission: { resource: 'org', action: 'update' },
          },
        ],
        userOrganizationRoles: [
          {
            role: {
              role: 'manager',
              rolePermissions: [
                {
                  permission: { resource: 'org', action: 'delete' },
                },
              ],
            },
          },
        ],
      };

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock_token');

      await expect(authService.signInOrganization(1, 2)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('buildRolePermissions', () => {
    it('should build permissions from roles correctly', () => {
      const mockRoles = [
        {
          role: {
            rolePermissions: [
              { permission: { resource: 'user', action: 'read' } },
              { permission: { resource: 'user', action: 'write' } },
            ],
          },
        },
      ];

      const result = authService['buildRolePermissions'](mockRoles);

      expect(result).toEqual(['user:read', 'user:write']);
    });
  });
});
