import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customers } from '../customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
