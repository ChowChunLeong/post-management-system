// role.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
