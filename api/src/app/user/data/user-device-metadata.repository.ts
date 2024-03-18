import { EntityRepository, Repository } from 'typeorm';
import { UserDeviceMetadataEntity } from './user-device-metadata.entity';

@EntityRepository(UserDeviceMetadataEntity)
export class UserDeviceMetadataRepository extends Repository<UserDeviceMetadataEntity> {}
