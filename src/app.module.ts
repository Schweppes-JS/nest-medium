import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@app/ormconfig';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
