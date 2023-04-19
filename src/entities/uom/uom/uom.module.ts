import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UOM } from '../uom.entity';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';

@Module({
  imports: [TypeOrmModule.forFeature([UOM])],
  controllers: [UomController],
  providers: [UomService],
})
export class UomModule {}
