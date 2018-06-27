// tslint:disable:no-console
import { Injectable } from '@nestjs/common';
import { Kraken } from 'exchanges/kraken';
import * as IDatafeed from './datafeed-api.d';
import * as IEx from 'exchanges/interface';

export interface UdfConfig extends IDatafeed.DatafeedConfiguration{
  supports_search?: boolean;
  supports_group_request?: boolean;
}
const kraken = new Kraken();
const supported_resolutions = ['5', '60', '1D'];

@Injectable()
export class KrakenService {
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
    let interval = 5;
    switch (resolution){
      case '60':
        interval = 60;
        break;
      case '1D':
        interval = 1440;
        break;
    }
    const option = {
      pair: symbolName,
      interval,
      since: from,
    };
    const hisRes = await kraken.getHistoryOHLC(option) as {[index: string]: number[][]};
    const hisData = hisRes[Object.keys(hisRes)[0]];
    if ( hisData.length === 0 ){
      return {s: 'no_data'};
    }
    const t: number[] = [], c: number[] = [], o: number[] = [], l: number[] = [], h: number[] = [], v: number[] = [];
    for ( const obj of hisData ){
      if ( obj[0] < to ){
        t.push(obj[0]);
        c.push(obj[4]);
        o.push(obj[1]);
        l.push(obj[3]);
        h.push(obj[2]);
        v.push(obj[6]);
      }

    }
    if ( t.length === 0 ){
      return {s: 'no_data'};
    }
    return {s: 'ok', t, c, o, l, h, v};
  }

  async showSymbols(){
    const res = await kraken.getTradingPairsInfo() as { [index: string]: IEx.KrakenSymbolsRawParam };
    if (!res || Object.keys(res).length === 0){
      return;
    }
    return res;
  }

  async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    maxRecords?: number ): Promise<IDatafeed.SearchSymbolResultItem[] | undefined> {
      const res = await kraken.getTradingPairsInfo() as IEx.KrakenSymbolsRawParam[];
      if (!res || res.length === 0){
        return;
      }
      const searchItems: IDatafeed.SearchSymbolResultItem[] = [];
      res.forEach(obj => {
        if (obj){
          const item: IDatafeed.SearchSymbolResultItem = {
            symbol: obj.altname,
            full_name: obj.altname,
            description: 'kraken_' + obj.altname,
            exchange: 'kraken',
            ticker: obj.altname,
            type: 'bitcoin'};
          searchItems.push(item);
        }
      });
      return searchItems;
  }

  async resolveSymbol(symbolName: string){
    const res = await kraken.getTradingPairsInfo() as { [index: string]: IEx.KrakenSymbolsRawParam };
    if (!res || Object.keys(res).length === 0){
      return;
    }
    const symbolKey = Object.keys(res).find(obj => {
      return obj === symbolName;
    });
    const symbolInfo = res[symbolKey];
    if (!symbolInfo){
      return;
    }
    return{
	    name: symbolInfo.altname,
	    full_name: symbolInfo.altname,
	    base_name: symbolInfo.altname,
      ticker: symbolInfo.altname,
      description: 'kraken_' + symbolInfo.base + symbolInfo.quote,
      type: 'bitcoin',
	    session: '24x7',
      exchange: 'kraken',
      listed_exchange: 'kraken',
      timezone: 'UTC',
	    pricescale: symbolInfo.pair_decimals,
      minmov: 10 ** ((-1) * symbolInfo.lot_decimals),
	    has_intraday: true,
	    supported_resolutions,
	    has_daily: true,
	    has_weekly_and_monthly: false,
	    has_no_volume: false,
      sector: 'main',
    };
  }

}
