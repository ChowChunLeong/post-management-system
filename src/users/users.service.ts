import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async createUser(data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const { username, email, password, role } = data;

    const existing = await this.userRepo.findOne({
      where: [{ username }, { email }],
    });
    if (existing) {
      throw new BadRequestException('Username or email already exists');
    }

    const roleData = await this.rolesService.findRoleByName(role);
    if (!roleData) {
      throw new NotFoundException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      username,
      email,
      password_hash: hashedPassword,
      role: roleData,
    });

    return this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async findUserByIdOrFail(userId: number): Promise<User | null> {
    return this.userRepo.findOneByOrFail({
      id: userId,
    });
  }
}
