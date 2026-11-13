import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClusterNode } from './entities/cluster-node.entity';
import { WebsiteSaved } from './entities/website-saved.entity';
import { WebsiteSubmission } from './entities/website-submission.entity';
import { NodesController } from './nodes.controller';
import { DirectoryService } from './directory.service';
import { SubmissionsController } from './submissions.controller';
import { WebsitesSavedController } from './websites-saved.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'webs_explore',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [WebsiteSubmission, WebsiteSaved, ClusterNode],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    TypeOrmModule.forFeature([WebsiteSubmission, WebsiteSaved, ClusterNode]),
  ],
  controllers: [AppController, SubmissionsController, WebsitesSavedController, NodesController],
  providers: [AppService, DirectoryService],
})
export class AppModule {}
