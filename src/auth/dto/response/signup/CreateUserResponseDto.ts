import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './UserResponseDto';

export class CreateUserResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
