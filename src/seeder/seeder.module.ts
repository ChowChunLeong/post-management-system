import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/roles.entity';
import { SeederService } from './seeder.service';
import { Module } from '@nestjs/common';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
