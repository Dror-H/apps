import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database.config.service';
@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigService],
      useClass: DatabaseConfigService,
    }),
  ],
})
export class DatabaseModule {}
