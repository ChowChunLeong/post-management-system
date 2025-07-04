import { Injectable } from '@nestjs/common';
import { Role } from './roles.entity';
import { Repository } from 'typeorm';
import { RoleName } from './role.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  @InjectRepository(Role)
  private roleRepo: Repository<Role>;
  async findRoleByName(role: string): Promise<Role | null> {
    return this.roleRepo.findOne({
      where: { name: RoleName[role.toUpperCase()] },
    });
  }
}
