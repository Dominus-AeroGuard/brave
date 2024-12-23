import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { DateTime } from 'luxon';

describe('PermissionController', () => {
  let controller: PermissionController;
  let service: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createPermissionDto: CreatePermissionDto = {
        resource: 'resource',
        action: 'action',
        description: 'descrição',
      };
      const permission: Permission = new Permission(
        1,
        'resource',
        'action',
        'descrição',
        true,
        null,
        DateTime.now().toJSDate(),
        DateTime.now().toJSDate(),
      );
      const user = { userId: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(permission);

      const result = await controller.create({ user }, createPermissionDto);

      expect(service.create).toHaveBeenCalledWith(
        createPermissionDto,
        user.userId,
      );
      expect(result).toEqual(permission);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const query = { q: 'test', page: 1, size: 10 };
      jest.spyOn(service, 'findAll').mockResolvedValue({
        data: [],
        meta: { count: 0, countRecords: 0, page: 1, size: 10 },
      });

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith('test', 1, 10);
      expect(result).toEqual({
        data: [],
        meta: { count: 0, countRecords: 0, page: 1, size: 10 },
      });
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const id = '1';
      const permission: Permission = new Permission(
        1,
        'resource',
        'action',
        'descrição',
        true,
        null,
        DateTime.now().toJSDate(),
        DateTime.now().toJSDate(),
      );
      jest.spyOn(service, 'findOne').mockResolvedValue(permission);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(permission);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = '1';
      const updatePermissionDto: UpdatePermissionDto = {
        resource: 'resource',
        action: 'action',
        description: 'desc',
      };
      const permission: Permission = new Permission(
        1,
        'resource',
        'action',
        'descrição',
        true,
        null,
        DateTime.now().toJSDate(),
        DateTime.now().toJSDate(),
      );
      jest.spyOn(service, 'update').mockResolvedValue(permission);

      const result = await controller.update(id, updatePermissionDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePermissionDto);
      expect(result).toEqual(permission);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
