import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { DateTime } from 'luxon';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
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

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createRoleDto: CreateRoleDto = {
        role: 'admin',
        description: 'descrição',
      };
      const role: Role = new Role(
        1,
        'admin',
        'descrição',
        true,
        false,
        DateTime.now().toJSDate(),
        DateTime.now().toJSDate(),
      );
      const user = { userId: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(role);

      const result = await controller.create({ user }, createRoleDto);

      expect(service.create).toHaveBeenCalledWith(createRoleDto, user.userId);
      expect(result).toEqual(role);
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
      const role: Role = new Role(
        1,
        'admin',
        'descrição',
        true,
        false,
        DateTime.now().toJSDate(),
        DateTime.now().toJSDate(),
      );
      jest.spyOn(service, 'findOne').mockResolvedValue(role);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(role);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = '1';
      const updateRoleDto: UpdateRoleDto = {
        role: 'user',
        description: 'desc',
      };
      const role: Role = new Role(
        1,
        'admin',
        'descrição',
        true,
        false,
        DateTime.now().toJSDate(),
        DateTime.now().toJSDate(),
      );
      jest.spyOn(service, 'update').mockResolvedValue(role);

      const result = await controller.update(id, updateRoleDto);

      expect(service.update).toHaveBeenCalledWith(1, updateRoleDto);
      expect(result).toEqual(role);
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
