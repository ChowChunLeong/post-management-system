import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'EDITOR' })
  name: string;

  @ApiProperty({ example: 'Editor' })
  description: string;
}
