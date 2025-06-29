import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import * as bcrypt from 'bcrypt';
import { RoleName } from 'src/roles/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async createUser(data: {
    username: string;
    email: string;
    password: string;
    roleName: string;
  }): Promise<User> {
    const { username, email, password, roleName } = data;

    const existing = await this.userRepo.findOne({
      where: [{ username }, { email }],
    });
    if (existing) {
      throw new BadRequestException('Username or email already exists');
    }

    const role = await this.roleRepo.findOne({
      where: { name: RoleName[roleName.toUpperCase()] },
    });
    if (!role) {
      throw new NotFoundException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      username,
      email,
      password_hash: hashedPassword,
      role,
    });

    return this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { username },
      relations: ['role'],
    });
  }
}
