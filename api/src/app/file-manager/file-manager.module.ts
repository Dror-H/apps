import { MulterConfigService, UploadUtilityModule } from '@instigo-app/upload-utility';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './controllers/file.controller';
import { FileRepository } from './data/file.repository';
import { FileNestCrudService } from './services/file.nestcrud.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    UploadUtilityModule,
  ],
  providers: [FileNestCrudService],
  controllers: [FileController],
  exports: [TypeOrmModule, FileNestCrudService],
})
export class FileManagerModule {}
