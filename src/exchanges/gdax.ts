// tslint:disable:no-console
import { Util, tryCatch } from 'ns-common';
import * as IEx from 'exchanges/interface';
import * as querystring from 'querystring';
const baseUrl = 'https://api.gdax.com/';
const GdaxSymbolDataIndex = -1;
const GdaxKlineDataIndex = -1;

/**
 * @class
 * @classdesc {@link https://api.gdax.com/ | Gdax interface}
 */
export class Gdax {

    @tryCatch('get data from url')
    private async getFindInfo(url: string, dataIndex: number){
        // console.log(url);
        if (url) {
            const res = await Util.fetch(url);
            const jsonRes: { [index: string]: any } = await res.json();
            console.log(jsonRes);
            if (dataIndex === -1) return jsonRes;
            if (Object.keys(jsonRes).length !== 0) {
                return jsonRes[Object.keys(jsonRes)[dataIndex]];
            }
            return null;
        }
    }

    @tryCatch('get possible trading pairs')
    getTradingPairsInfo(){
        const url = baseUrl + 'products';
        return this.getFindInfo(url, GdaxSymbolDataIndex);
    }

    @tryCatch('get kline from trading pair info')
    getHistoryOHLC(symbol: string, reqParam: IEx.GdaxKlineReqParam){
        const url = baseUrl + 'products/' + symbol + '/candles?' + querystring.stringify(reqParam);
        console.log(url);
        return this.getFindInfo(url, GdaxKlineDataIndex);

    }
}