import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EventsRepository } from '@api/events/data/events.repository';
import { EventsEntity } from '@api/events/data/events.entity';

@Injectable()
export class EventsNestCrudService extends TypeOrmCrudService<EventsEntity> {
  constructor(@Inject(EventsRepository) eventsRepository: EventsRepository) {
    super(eventsRepository);
  }
}
