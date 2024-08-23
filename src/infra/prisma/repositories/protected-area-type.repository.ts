import { ProtectedAreaType } from '../../../domain/entities/protected-area.entity';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

export interface IProtectedAreaTypeRepository {
  findAll(): Promise<ProtectedAreaType[]>;
}

@Injectable()
export class ProtectedAreaTypeRepository implements IProtectedAreaTypeRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProtectedAreaType[]> {
    const protectedAreaTypes = await this.prisma.protectedAreaType.findMany({
      where: {
        active: true,
      },
      orderBy: {
        protected_area_type_id: 'asc',
      }
    });

    return protectedAreaTypes.map((type) => {
      return new ProtectedAreaType(
        type.protected_area_type_id, 
        type.name, 
        type.description,
        type.distance,
        type.distance_drone
      );
    });
  }

}
