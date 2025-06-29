import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './UserResponseDto';

export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    example: 'rwekrkewkrkkwlekrewmcmskkdf...',
    description: 'JWT access token for authenticated requests',
  })
  accessToken: string;
}
