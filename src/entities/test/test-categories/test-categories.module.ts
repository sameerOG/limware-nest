import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { TestCategory } from '../test_category.entity';
import { TestCategoriesController } from './test-categories.controller';
import { TestCategoriesService } from './test-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestCategory, Laboratory])],
  controllers: [TestCategoriesController],
  providers: [TestCategoriesService],
})
export class TestCategoriesModule {}
