import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password_hash: string;

  @ApiProperty({ type: RoleDto })
  role: RoleDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
