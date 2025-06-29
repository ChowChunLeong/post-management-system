import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'testing2' })
  username: string;

  @ApiProperty({ example: 'testing2@gmail.com' })
  email: string;
}
