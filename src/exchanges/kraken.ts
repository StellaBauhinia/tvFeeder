// tslint:disable:no-console
import { Util, tryCatch } from 'ns-common';
import * as IEx from 'exchanges/interface';
import * as querystring from 'querystring';
const baseUrl = 'https://api.kraken.com/';
const KrakenSymbolDataIndex = 1;
const KrakenKlineDataIndex = 1;

/**
 * @class
 * @classdesc {@link https://api.kraken.com/ | Kraken interface}
 */
export class Kraken {

    @tryCatch('get data from url')
    private async getFindInfo(url: string, dataIndex: number){
        // console.log(url);
        if (url) {
            const res = await Util.fetch(url);
            const jsonRes: { [index: string]: any } = await res.json();
            // console.log(jsonRes[Object.keys(jsonRes)[dataIndex]]);
            if (dataIndex === -1) return jsonRes;
            if (Object.keys(jsonRes).length !== 0) {
                return jsonRes[Object.keys(jsonRes)[dataIndex]];
            }
            return null;
        }
    }

    @tryCatch('get possible trading pairs')
    getTradingPairsInfo(){
        const url = baseUrl + '0/public/AssetPairs';
        return this.getFindInfo(url, KrakenSymbolDataIndex);
    }

    @tryCatch('get kline from trading pair info')
    getHistoryOHLC(reqParam: IEx.KrakenKlineReqParam){
        const url = baseUrl + '0/public/OHLC?' + querystring.stringify(reqParam);
        console.log(url);
        return this.getFindInfo(url, KrakenKlineDataIndex);

    }
}