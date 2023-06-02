import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addons } from '../addons.entity';
import { AddonsController } from './addons.controller';
import { AddonsService } from './addons.service';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Customers } from 'src/entities/customer/customer.entity';
import { FacilitiesService } from 'src/entities/Facility/facilities/facilities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Addons, Facility, Customers])],
  controllers: [AddonsController],
  providers: [AddonsService, FacilitiesService],
})
export class AddonsModule {}
