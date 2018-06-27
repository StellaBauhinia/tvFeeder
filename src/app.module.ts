import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { HuobiService } from './huobi.service';
// import { GdaxService } from './gdax.service';
import { KrakenService } from './kraken.service';

@Module({
  imports: [],
  controllers: [AppController],
  // providers: [HuobiService],
  // providers: [GdaxService],
  providers: [KrakenService],
})
export class AppModule {}
