export interface HuobiSymbolsRawParam{
    'base-currency': string;
    'quote-currency': string;
    'price-precision': number;
    'amount-precision': number;
    'symbol-partition': string;
}

export interface HuobiKlineReqParam{
    symbol: string;
    period: string;
    size: number;
}

export interface HuobiKlineOutput{
    id: number;
    open: number;
    close: number;
    low: number;
    high: number;
    amount: number;
    vol: number;
    count: number;
}

export interface GdaxSymbolsRawParam{
    id: string;
    base_currency: string;
    quote_currency: string;
    base_min_size: string;
    base_max_size: string;
    quote_increment: string;
    display_name: string;
    status: string;
    margin_enabled: boolean;
    status_message: string | null;
    min_market_funds: string;
    max_market_funds: string;
    post_only: boolean;
    limit_only: boolean;
    cancel_only: boolean;
}

export interface GdaxKlineReqParam{
    start: string;
    end: string;
    granularity: number;
}

export interface KrakenSymbolsRawParam{
    altname: string;
    aclass_base: string;
    base: string;
    aclass_quote: string;
    quote: string;
    lot: string;
    pair_decimals: number;
    lot_decimals: number;
    lot_multiplier: number;
    leverage_buy?: any;
    leverage_sell?: any;
    fees?: any;
    fees_maker?: any;
    fee_volume_currency?: string;
    margin_call?: number;
    margin_stop?: number;
}

export interface KrakenKlineReqParam{
    pair: string;
    interval: number;
    since: number;
}