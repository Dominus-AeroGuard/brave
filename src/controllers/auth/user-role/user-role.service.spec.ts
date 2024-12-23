import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleService } from './user-role.service';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import {
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

describe('UserRoleService', () => {
  let service: UserRoleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleService,
        {
          provide: PrismaService,
          useValue: {
            role: { count: jest.fn() },
            userRole: {
              findMany: jest.fn(),
              createMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserRoleService>(UserRoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if organization roles are present', async () => {
      jest.spyOn(prisma.role, 'count').mockResolvedValue(1);

      const createUserRoleDto: CreateUserRoleDto = { data: [1, 2] };

      await expect(service.create(1, createUserRoleDto, 1)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should create user roles if no conflicts exist', async () => {
      jest.spyOn(prisma.role, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.userRole, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.userRole, 'createMany').mockResolvedValue({ count: 2 });

      const createUserRoleDto: CreateUserRoleDto = { data: [1, 2] };

      const result = await service.create(1, createUserRoleDto, 1);

      expect(prisma.userRole.createMany).toHaveBeenCalledWith({
        data: [
          { user_id: 1, role_id: 1, created_by: 1 },
          { user_id: 1, role_id: 2, created_by: 1 },
        ],
      });
      expect(result).toBeDefined();
    });

    it('should create just user roles not asigned to user', async () => {
      jest.spyOn(prisma.role, 'count').mockResolvedValue(0);
      jest
        .spyOn(prisma.userRole, 'findMany')
        .mockResolvedValueOnce([{ role_id: 1 }] as any);
      jest.spyOn(prisma.userRole, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.userRole, 'createMany').mockResolvedValue({ count: 2 });

      const createUserRoleDto: CreateUserRoleDto = { data: [1, 2] };

      const result = await service.create(1, createUserRoleDto, 1);

      expect(prisma.userRole.createMany).toHaveBeenCalledWith({
        data: [{ user_id: 1, role_id: 2, created_by: 1 }],
      });
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all active roles for a user', async () => {
      jest.spyOn(prisma.userRole, 'findMany').mockResolvedValue([
        {
          role: { role_id: 1, role: 'Admin', organization_id: 10 },
        },
      ] as any);

      const result = await service.findAll(1);

      expect(result).toEqual([{ id: 1, role: 'Admin', organizationId: 10 }]);
    });
  });

  describe('findOne', () => {
    it('should return a user role', async () => {
      jest.spyOn(prisma.userRole, 'findFirst').mockResolvedValue({
        role: { role_id: 1, role: 'Admin', organization_id: 10 },
      } as any);

      const result = await service.findOne(1, 1);

      expect(result).toEqual({ id: 1, role: 'Admin', organizationId: 10 });
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(prisma.userRole, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user role', async () => {
      const mockUserRole = {
        user_role_id: 1,
        role: { role_id: 1, role: 'Admin', organization_id: 10 },
      };
      jest
        .spyOn(prisma.userRole, 'findFirst')
        .mockResolvedValue(mockUserRole as any);

      jest.spyOn(prisma.userRole, 'update').mockResolvedValue(null);

      const result = await service.remove(1, 1);

      expect(prisma.userRole.update).toHaveBeenCalledWith({
        data: { removed_at: expect.any(String) },
        where: { user_role_id: 1 },
      });
      expect(result).toBeDefined();
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(prisma.userRole, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
