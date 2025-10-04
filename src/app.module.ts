import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOpts } from './data-source';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { SeriesSuggestionsModule } from './series-suggestions/series-suggestions.module';
import { ConfigifyModule } from '@itgorillaz/configify';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOpts,
      autoLoadEntities: true,
      synchronize: true,
      })
    }),
    ConfigifyModule.forRootAsync(),
    RatingsModule,
    UsersModule,
    AuthModule,
    SeriesSuggestionsModule,
  ],
  controllers: [AppController],
  providers: [
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipe
  }
    ,
    AppService],
})
export class AppModule {}
