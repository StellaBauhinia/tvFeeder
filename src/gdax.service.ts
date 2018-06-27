// tslint:disable:no-console
import { Injectable } from '@nestjs/common';
import { Gdax } from 'exchanges/gdax';
import * as IDatafeed from './datafeed-api.d';
import * as IEx from 'exchanges/interface';

export interface UdfConfig extends IDatafeed.DatafeedConfiguration{
  supports_search?: boolean;
  supports_group_request?: boolean;
}
const gdax = new Gdax();
const supported_resolutions = ['5', '60', '1D'];

@Injectable()
export class GdaxService {
  getServerTime(): string {
    return Math.floor(Date.now() / 1000) + '';
  }

  getConfig(): UdfConfig {
    return {
      supports_search: true,
      supports_group_request: false,
      supported_resolutions,
      supports_marks: false,
      supports_time: true };
  }

  async getHistory(symbolName: string, from: number, to: number, resolution: string){
      // ['5', '60', '1D']
    let granularity = 300;
    switch (resolution){
      case '60':
        granularity = 3600;
        break;
      case '1D':
        granularity = 86400;
        break;
    }
    const option = {
      start: new Date(from * 1000).toISOString(),
      end: new Date(to * 1000).toISOString(),
      granularity };
    const hisRes = await gdax.getHistoryOHLC(symbolName, option) as number[][];
    if ( hisRes.length === 0 ){
      return {s: 'no_data'};
    }
    const t: number[] = [], c: number[] = [], o: number[] = [], l: number[] = [], h: number[] = [], v: number[] = [];
    for ( const obj of hisRes ){
      t.push(obj[0]);
      c.push(obj[4]);
      o.push(obj[3]);
      l.push(obj[1]);
      h.push(obj[2]);
      v.push(obj[5]);

    }
    if ( t.length === 0 ){
      return {s: 'no_data'};
    }
    return {s: 'ok', t, c, o, l, h, v};
  }

  async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    maxRecords?: number ): Promise<IDatafeed.SearchSymbolResultItem[] | undefined> {
      const res = await gdax.getTradingPairsInfo() as IEx.GdaxSymbolsRawParam[];
      if (!res || res.length === 0){
        return;
      }
      const searchItems: IDatafeed.SearchSymbolResultItem[] = [];
      res.forEach(obj => {
        if (obj){
          const item: IDatafeed.SearchSymbolResultItem = {
            symbol: obj.id,
            full_name: obj.display_name,
            description: 'gdax_' + obj.display_name,
            exchange: 'gdax',
            ticker: obj.id,
            type: 'bitcoin'};
          searchItems.push(item);
        }
      });
      return searchItems;
  }

  async resolveSymbol(symbolName: string){
    const res = await gdax.getTradingPairsInfo() as IEx.GdaxSymbolsRawParam[];
    if (!res || res.length === 0){
      return;
    }
    const symbolInfo = res.find(obj => {
      return obj.id === symbolName;
    });
    if (!symbolInfo){
      return;
    }
    return{
	    name: symbolInfo.id,
	    full_name: symbolInfo.id,
	    base_name: symbolInfo.id,
      ticker: symbolInfo.id,
      description: 'gdax_' + symbolInfo.base_currency + symbolInfo.quote_currency,
      type: 'bitcoin',
	    session: '24x7',
      exchange: 'gdax',
      listed_exchange: 'gdax',
      timezone: 'UTC',
	    pricescale: 1,
      minmov: symbolInfo.quote_increment,
	    has_intraday: true,
	    supported_resolutions,
	    has_daily: true,
	    has_weekly_and_monthly: false,
	    has_no_volume: false,
      sector: 'main',
    };
  }

}
