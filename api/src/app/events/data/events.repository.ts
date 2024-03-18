import { EntityRepository, Repository } from 'typeorm';
import { EventsEntity } from '@api/events/data/events.entity';

@EntityRepository(EventsEntity)
export class EventsRepository extends Repository<EventsEntity> {}
