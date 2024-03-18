import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './controller/events.controller';
import { EventsRepository } from '@api/events/data/events.repository';
import { EventsNestCrudService } from '@api/events/service/events.nescrud.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventsRepository])],
  providers: [EventsNestCrudService],
  controllers: [EventsController],
  exports: [TypeOrmModule],
})
export class EventsModule {}
