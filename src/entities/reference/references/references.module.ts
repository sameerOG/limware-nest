import { Module } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import { Reference } from '../reference.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reference])],
  controllers: [ReferencesController],
  providers: [ReferencesService],
})
export class ReferencesModule {}
