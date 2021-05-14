import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/cache/redis-cache.module';
import { SessionService } from './session.service';

@Module({
  imports : [RedisCacheModule],
  providers: [SessionService],
  exports : [SessionService],
})
export class SessionModule {}
