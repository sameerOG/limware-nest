import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addons } from 'src/entities/addons/addons.entity';
import { Customers } from 'src/entities/customer/customer.entity';
import { Facility } from '../facility.entity';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { DirectoryManagerService } from 'src/shared/DirectoryManagerService';
import { FacilitiesSMSController } from '../facility_sms_settings/facility_sms_settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Facility, Customers, Addons])],
  controllers: [FacilitiesController],
  providers: [FacilitiesService, DirectoryManagerService]
})
export class FacilitiesModule {}
