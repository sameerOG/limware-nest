import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutgoingMailServer } from '../outgoing_mail_server.entity';
import { OutgoingMailServersController } from './outgoing-mail-servers.controller';
import { OutgoingMailServersService } from './outgoing-mail-servers.service';

@Module({
  imports: [TypeOrmModule.forFeature([OutgoingMailServer])],
  controllers: [OutgoingMailServersController],
  providers: [OutgoingMailServersService],
})
export class OutgoingMailServersModule {}
