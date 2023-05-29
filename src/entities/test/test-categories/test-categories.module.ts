import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/entities/department/department.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { TestCategory } from '../test_category.entity';
import { TestCategoriesController } from './test-categories.controller';
import { TestCategoriesService } from './test-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestCategory, Laboratory, Department])],
  controllers: [TestCategoriesController],
  providers: [TestCategoriesService],
})
export class TestCategoriesModule {}
