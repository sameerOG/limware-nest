import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addons } from '../addons.entity';
import { AddonsController } from './addons.controller';
import { AddonsService } from './addons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Addons])],
  controllers: [AddonsController],
  providers: [AddonsService],
})
export class AddonsModule {}
