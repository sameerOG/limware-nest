import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { specimen } from '../specimen.entity';
import { SpecimensController } from './specimens.controller';
import { SpecimensService } from './specimens.service';

@Module({
  imports: [TypeOrmModule.forFeature([specimen])],
  controllers: [SpecimensController],
  providers: [SpecimensService],
})
export class SpecimensModule {}
