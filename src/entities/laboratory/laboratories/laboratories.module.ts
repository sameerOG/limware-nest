import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from '../laboratory.entity';
import { LaboratoriesController } from './laboratories.controller';
import { LaboratoriesService } from './laboratories.service';
import { FacilitiesService } from 'src/entities/Facility/facilities/facilities.service';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Customers } from 'src/entities/customer/customer.entity';
import { Addons } from 'src/entities/addons/addons.entity';
import { LaboratorySetting } from '../laboratory_setting.entity';
import { LaboratorySettingsController } from 'src/entities/laboratory/laboratories_settings/laboratories.settings.controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory, Facility, Customers, Addons, LaboratorySetting])],
  controllers: [LaboratoriesController, LaboratorySettingsController],
  providers: [LaboratoriesService, FacilitiesService],
})
export class LaboratoriesModule {}
