import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';

describe('UserRoleController', () => {
  let controller: UserRoleController;
  let service: UserRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRoleController],
      providers: [
        UserRoleService,
        {
          provide: PrismaService,
          useValue: {
            role: { count: jest.fn() },
            userRole: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              createMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UserRoleController>(UserRoleController);
    service = module.get<UserRoleService>(UserRoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create user roles', async () => {
      const userId = 1;
      const mockCreateDto: CreateUserRoleDto = { data: [1, 2] };
      const mockUser = { userId: 10 };
      const mockResult: UserRole[] = [
        new UserRole(1, 'Admin', 10),
        new UserRole(2, 'User', null),
      ];

      jest.spyOn(service, 'create').mockResolvedValue(mockResult);

      const result = await controller.create(userId.toString(), mockCreateDto, {
        user: mockUser,
      });
      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(
        userId,
        mockCreateDto,
        mockUser.userId,
      );
    });
  });

  describe('findAll', () => {
    it('should return all user roles', async () => {
      const userId = 1;
      const mockResult: UserRole[] = [
        new UserRole(1, 'Admin', 10),
        new UserRole(2, 'User', null),
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll(userId.toString());
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a specific user role', async () => {
      const userId = 1;
      const roleId = 2;
      const mockResult = new UserRole(2, 'User', null);

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult);

      const result = await controller.findOne(
        userId.toString(),
        roleId.toString(),
      );
      expect(result).toEqual(mockResult);
      expect(service.findOne).toHaveBeenCalledWith(userId, roleId);
    });

    it('should throw NotFoundException if role is not found', async () => {
      const userId = 1;
      const roleId = 999;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOne(userId.toString(), roleId.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user role', async () => {
      const userId = 1;
      const roleId = 2;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(userId.toString(), roleId.toString());
      expect(service.remove).toHaveBeenCalledWith(userId, roleId);
    });
  });
});
