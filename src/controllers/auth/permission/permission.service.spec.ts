import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

describe('PermissionService', () => {
  let service: PermissionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    permission: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    userPermission: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if permission already exists', async () => {
      jest.spyOn(prisma.permission, 'count').mockResolvedValue(1);
      const createPermissionDto: CreatePermissionDto = {
        resource: 'aplication',
        action: 'read',
        description: 'Test permission',
      };

      await expect(service.create(createPermissionDto, 1)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new permission if it does not exist', async () => {
      jest.spyOn(prisma.permission, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.permission, 'create').mockResolvedValue({
        permission_id: 1,
        resource: 'aplication',
        action: 'read',
        description: 'Test permission',
        active: true,
        organization_permission: false,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
      });

      const createPermissionDto: CreatePermissionDto = {
        resource: 'aplication',
        action: 'read',
        description: 'Test permission',
      };
      const result = await service.create(createPermissionDto, 1);

      expect(prisma.permission.create).toHaveBeenCalledWith({
        data: {
          description: 'Test permission',
          resource: 'aplication',
          action: 'read',
          created_by: 1,
        },
      });
      expect(result).toBeInstanceOf(Permission);
      expect(result.resource).toEqual('aplication');
      expect(result.action).toEqual('read');
    });
  });

  describe('findAll', () => {
    it('should return paginated permissions', async () => {
      jest.spyOn(prisma.permission, 'count').mockResolvedValue(1);
      jest.spyOn(prisma.permission, 'findMany').mockResolvedValue([
        {
          permission_id: 1,
          resource: 'test',
          action: 'test',
          description: 'Test permission',
          active: true,
          organization_permission: false,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
        },
      ]);

      const result = await service.findAll('test', 1, 10);

      expect(prisma.permission.count).toHaveBeenCalled();
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { description: { contains: 'test' } },
            { resource: { contains: 'test' } },
            { action: { contains: 'test' } },
          ],
        },
        take: 10,
        skip: 0,
        orderBy: {
          created_at: 'desc',
        },
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toBeInstanceOf(Permission);
    });
  });

  describe('findOne', () => {
    it('should return a permission by ID', async () => {
      const mockPermission = {
        permission_id: 1,
        resource: 'aplication',
        action: 'read',
        description: 'Test permission',
        active: true,
        organization_permission: null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
      };
      jest
        .spyOn(prisma.permission, 'findUniqueOrThrow')
        .mockResolvedValue(mockPermission);

      const result = await service.findOne(1);

      expect(prisma.permission.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { permission_id: 1 },
      });
      expect(result).toBeInstanceOf(Permission);
      expect(result.resource).toEqual('aplication');
      expect(result.action).toEqual('read');
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const mockPermission = {
        permission_id: 1,
        resource: 'aplication',
        action: 'read',
        description: 'Updated permission',
        active: true,
        organization_permission: null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
      };

      jest.spyOn(prisma.permission, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.permission, 'update').mockResolvedValue(mockPermission);
      jest
        .spyOn(prisma.permission, 'findUniqueOrThrow')
        .mockResolvedValue(mockPermission);

      const updatePermissionDto: UpdatePermissionDto = {
        resource: 'aplication',
        action: 'read',
        description: 'Updated permission',
      };
      const result = await service.update(1, updatePermissionDto);

      expect(prisma.permission.update).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Permission);
      expect(result.description).toEqual('Updated permission');
    });
  });

  describe('remove', () => {
    it('should deactivate a permission', async () => {
      jest.spyOn(prisma.permission, 'update').mockResolvedValue(undefined);

      await service.remove(1);

      expect(prisma.permission.update).toHaveBeenCalledWith({
        where: { permission_id: 1 },
        data: { active: false },
      });
    });
  });
});
