import { Module, OnModuleInit } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIService } from './open-ai.service';
import { ConfigModule } from '@nestjs/config';
import { DATA_PATH } from './constants';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, OpenAIService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    try {
      mkdirSync(DATA_PATH, { recursive: true });
      console.log('data directory is ready');
    } catch (err) {
      console.error('Failed to create data directory', err);
    }
  }
}
