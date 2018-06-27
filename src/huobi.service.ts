// tslint:disable:no-console
import { Injectable } from '@nestjs/common';
import { Huobi } from 'exchanges/huobi';
import * as IDatafeed from './datafeed-api.d';
import * as IEx from 'exchanges/interface';

export interface UdfConfig extends IDatafeed.DatafeedConfiguration{
  supports_search?: boolean;
  supports_group_request?: boolean;
}
const hb = new Huobi();
const supported_resolutions = ['5', '60', '1D', '1W', '1M'];

@Injectable()
export class HuobiService {
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
      // ['5', '60', '1D', '1W', '1M']
    let period = '5min';
    const size = 1000;
    switch (resolution){
      case '60':
        period = '60min';
        break;
      case '1D':
        period = '1day';
        break;
      case '1W':
        period = '1week';
        break;
      case '1M':
        period = '1mon';
        break;
    }
    const option = {
      symbol: symbolName,
      period, size };
    const hisRes = await hb.getHistoryOHLC(option) as IEx.HuobiKlineOutput[];
    const t: number[] = [], c: number[] = [], o: number[] = [], l: number[] = [], h: number[] = [], v: number[] = [];
    hisRes.forEach((obj: IEx.HuobiKlineOutput) => {
      if ( obj.id <= to && obj.id >= from ){
        console.log(obj.id);
        t.push(obj.id);
        c.push(obj.close);
        o.push(obj.open);
        l.push(obj.low);
        h.push(obj.high);
        v.push(obj.vol);
      }
    });
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
      const res = await hb.getTradingPairsInfo() as IEx.HuobiSymbolsRawParam[];
      if (!res || res.length === 0){
        return;
      }
      const searchItems: IDatafeed.SearchSymbolResultItem[] = [];
      res.forEach(obj => {
        if (obj){
          const item: IDatafeed.SearchSymbolResultItem = {
            symbol: obj['base-currency'] + obj['quote-currency'],
            full_name: obj['base-currency'] + obj['quote-currency'],
            description: 'huobi_' + obj['symbol-partition'],
            exchange: 'huobipro',
            ticker: obj['base-currency'] + '_' + obj['quote-currency'],
            type: 'bitcoin'};
          searchItems.push(item);
        }
      });
      return searchItems;
  }

  async resolveSymbol(symbolName: string){
    const res = await hb.getTradingPairsInfo() as IEx.HuobiSymbolsRawParam[];
    if (!res || res.length === 0){
      return;
    }
    const symbolInfo = res.find(obj => {
      return obj['base-currency'] + obj['quote-currency'] === symbolName;
    });
    if (!symbolInfo){
      return;
    }
    return{
	    name: symbolInfo['base-currency'] + symbolInfo['quote-currency'],
	    full_name: symbolInfo['base-currency'] + symbolInfo['quote-currency'],
	    base_name: symbolInfo['base-currency'],
      ticker: symbolInfo['base-currency'] + symbolInfo['quote-currency'],
      description: 'huobi_' + symbolInfo['base-currency'] + symbolInfo['quote-currency'],
      type: 'bitcoin',
	    session: '24x7',
      exchange: 'huobipro',
      listed_exchange: 'huobipro',
      timezone: 'UTC',
	    pricescale: symbolInfo['price-precision'],
      minmov: 0.01,
	    has_intraday: true,
	    supported_resolutions,
	    has_daily: true,
	    has_weekly_and_monthly: true,
	    has_no_volume: false,
      sector: 'main',
    };
  }

}
