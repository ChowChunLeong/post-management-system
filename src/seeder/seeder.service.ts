import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from 'src/roles/role.enum';
import { Role } from 'src/roles/roles.entity';
import { User } from 'src/users/users.entity';
import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const existing = await this.roleRepository.count();
    if (existing === 0) {
      const roles: DeepPartial<Role>[] = [
        { name: RoleName.ADMIN, description: 'Administrator' },
        { name: RoleName.EDITOR, description: 'Editor' },
        { name: RoleName.VIEWER, description: 'Viewer' },
      ];

      await this.roleRepository.save(roles);
      console.log('Roles seeded');
    }

    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      const adminRole = await this.roleRepository.findOneBy({
        name: RoleName.ADMIN,
      });
      if (!adminRole) throw new Error('Admin role not found');
      const hashedPassword = await bcrypt.hash('password', 10);

      await this.userRepository.save({
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        role: adminRole,
      });
    }
  }
}
