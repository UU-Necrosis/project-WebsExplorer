import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClusterNode } from './entities/cluster-node.entity';
import { User } from './entities/user.entity';
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
      password: process.env.DB_PASSWORD ?? 'khai_ID3571',
      database: process.env.DB_DATABASE ?? 'web-explore.db',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [WebsiteSubmission, WebsiteSaved, ClusterNode, User, AuditLog],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    TypeOrmModule.forFeature([WebsiteSubmission, WebsiteSaved, ClusterNode, User, AuditLog]),
  ],
  controllers: [AppController, AuthController, AuditController, SubmissionsController, WebsitesSavedController, NodesController],
  providers: [AppService, AuthService, AuditService, DirectoryService],
})
export class AppModule {}
