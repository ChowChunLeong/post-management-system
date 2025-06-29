import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './Role.dto';

export class AuthorDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: 'editor' })
  username: string;

  @ApiProperty({ example: 'editorg2@gmail.com' })
  email: string;

  @ApiProperty({ example: '$2b$10$xxxxxxx...' })
  password_hash: string;

  @ApiProperty({ type: RoleDto })
  role: RoleDto;

  @ApiProperty({ example: '2025-06-29T14:05:03.678Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-29T14:05:03.678Z' })
  updatedAt: string;
}
