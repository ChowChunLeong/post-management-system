import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'testing' })
  username: string;

  @ApiProperty({ example: 'testing@example.com' })
  email: string;

  @ApiProperty({ example: 'ADMIN' })
  role: string;
}
