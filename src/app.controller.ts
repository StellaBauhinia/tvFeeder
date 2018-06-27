// tslint:disable:no-console
import { Get, Response, Query, Controller, HttpStatus, UseFilters, HttpException } from '@nestjs/common';
// import { HuobiService } from './huobi.service';
// import { GdaxService } from './gdax.service';
import { KrakenService } from './kraken.service';
import { HttpExceptionFilter } from './http-exception.filter';
@Controller()
export class AppController {
  constructor(private readonly appService: KrakenService) {}

 private setDefaultHeader(res: any){
  res.header('Access-Control-Allow-Origin', '*');
    // list of methods (e.g. GET, HEAD, PUT, PATCH, POST, DELETE)
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 }

  @Get('time')
  time(@Response() res: any) {
    // console.log(new Date().toLocaleString(), '- GET time');
    try {
      this.setDefaultHeader(res);
      const time = this.appService.getServerTime();
      res.status(HttpStatus.OK).send(time);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('config')
  config(@Response() res: any) {
    // console.log('try to access config');
    try {
      this.setDefaultHeader(res);
      const config = this.appService.getConfig();
      res.status(HttpStatus.OK).send(config);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('search')
  async search(
    @Response() res: any,
    @Query('query') query: string,
    @Query('type') type: string,
    @Query('exchange') exchange: string,
    @Query('limit') limit: number){
      try{
        console.log('try to search somthing');
        this.setDefaultHeader(res);
        const searchRes = await this.appService.searchSymbols(query, exchange, type, limit);
        res.status(HttpStatus.OK).send(searchRes);
      }catch (e) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }

  @Get('symbols')
  async symbols(@Response() res: any, @Query('symbol') symbol: string) {
    // console.log('try to find some symbols');
    try {
      this.setDefaultHeader(res);
      const symbolInfo = await this.appService.resolveSymbol(symbol);
      res.status(HttpStatus.OK).send(symbolInfo);
    }catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('allsymbols')
  async allsymbols(@Response() res: any) {
    // console.log('try to find some symbols');
    try {
      this.setDefaultHeader(res);
      const symbols = await this.appService.showSymbols();
      res.status(HttpStatus.OK).send(symbols);
    }catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('history')
  async history(
    @Response() res: any,
    @Query('symbol') symbol: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('resolution') resolution: string) {
    console.log('try to find the kline ' + to + ' - ' + from);
    try {
      this.setDefaultHeader(res);
      const history = await this.appService.getHistory(symbol, from, to, resolution);
      res.status(HttpStatus.OK).send(history);
    }catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
