// tslint:disable:no-console
import { Util, tryCatch } from 'ns-common';
import * as IEx from 'exchanges/interface';
import * as querystring from 'querystring';
const baseUrl = 'https://api.huobi.br.com/';
const HuobiSymbolDataIndex = 1;
const HuobiKlineDataIndex = 3;

/**
 * @class
 * @classdesc {@link https://api.huobi.br.com | huobipro interface}
 */
export class Huobi {

    @tryCatch('get data from url')
    private async getFindInfo(url: string, dataIndex: number){
        // console.log(url);
        if (url) {
            const res = await Util.fetch(url);
            const jsonRes: { [index: string]: any } = await res.json();
            if (Object.keys(jsonRes).length !== 0) {
                return jsonRes[Object.keys(jsonRes)[dataIndex]];
            }
            return null;
        }
    }

    @tryCatch('get possible trading pairs')
    getTradingPairsInfo(){
        const url = baseUrl + 'v1/common/symbols';
        return this.getFindInfo(url, HuobiSymbolDataIndex);
    }

    @tryCatch('get kline from trading pair info')
    getHistoryOHLC(reqParam: IEx.HuobiKlineReqParam){
        const url = baseUrl + 'market/history/kline?' + querystring.stringify(reqParam);
        return this.getFindInfo(url, HuobiKlineDataIndex);

    }
}