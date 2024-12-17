import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: PrismaService;

  const mockPrismaService = {
    role: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    userRole: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if role already exists', async () => {
      jest.spyOn(prisma.role, 'count').mockResolvedValue(1);
      const createRoleDto: CreateRoleDto = {
        role: 'admin',
        description: 'Test role',
      };

      await expect(service.create(createRoleDto, 1)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new role if it does not exist', async () => {
      jest.spyOn(prisma.role, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.role, 'create').mockResolvedValue({
        role_id: 1,
        role: 'admin',
        description: 'Test role',
        active: true,
        organization_role: false,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
      });

      const createRoleDto: CreateRoleDto = {
        role: 'admin',
        description: 'Test role',
      };
      const result = await service.create(createRoleDto, 1);

      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          description: 'Test role',
          role: 'admin',
          created_by: 1,
        },
      });
      expect(result).toBeInstanceOf(Role);
      expect(result.role).toEqual('admin');
    });
  });

  describe('findAll', () => {
    it('should return paginated roles', async () => {
      jest.spyOn(prisma.role, 'count').mockResolvedValue(1);
      jest.spyOn(prisma.role, 'findMany').mockResolvedValue([
        {
          role_id: 1,
          role: 'admin',
          description: 'Test role',
          active: true,
          organization_role: false,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
        },
      ]);

      const result = await service.findAll('test', 1, 10);

      expect(prisma.role.count).toHaveBeenCalled();
      expect(prisma.role.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { description: { contains: 'test' } },
            { role: { contains: 'test' } },
          ],
        },
        take: 10,
        skip: 0,
        orderBy: {
          created_at: 'desc',
        },
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toBeInstanceOf(Role);
    });
  });

  describe('findOne', () => {
    it('should return a role by ID', async () => {
      const mockRole = {
        role_id: 1,
        role: 'admin',
        description: 'Test role',
        active: true,
        organization_role: null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
      };
      jest.spyOn(prisma.role, 'findUniqueOrThrow').mockResolvedValue(mockRole);

      const result = await service.findOne(1);

      expect(prisma.role.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { role_id: 1 },
      });
      expect(result).toBeInstanceOf(Role);
      expect(result.role).toEqual('admin');
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const mockRole = {
        role_id: 1,
        role: 'admin',
        description: 'Updated role',
        active: true,
        organization_role: null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
      };

      jest.spyOn(prisma.role, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.role, 'update').mockResolvedValue(mockRole);
      jest.spyOn(prisma.role, 'findUniqueOrThrow').mockResolvedValue(mockRole);

      const updateRoleDto: UpdateRoleDto = {
        role: 'admin',
        description: 'Updated role',
      };
      const result = await service.update(1, updateRoleDto);

      expect(prisma.role.update).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Role);
      expect(result.description).toEqual('Updated role');
    });
  });

  describe('remove', () => {
    it('should deactivate a role', async () => {
      jest.spyOn(prisma.role, 'update').mockResolvedValue(undefined);

      await service.remove(1);

      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { role_id: 1 },
        data: { active: false },
      });
    });
  });
});
