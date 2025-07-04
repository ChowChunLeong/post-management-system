import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    return {
      user: { id: user.id, username: user.username, email: user.email },
    };
  }
  async login(loginDto: { username: string; password: string }) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
      accessToken: token,
    };
  }
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.sign(payload);
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return user;
    }

    return null;
  }
}
