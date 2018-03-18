import * as request from 'request-promise-native';

export interface StocksApi {
  getHistory(symbol: string): any;
  getSMA(symbol: string): any;
}

export class AlphaVantageApi implements StocksApi {

  private readonly api_url = 'https://www.alphavantage.co/query';
  private readonly api_key = 'PQKR6O30ZYPDPABM';

  public async getHistory(symbol: string): Promise<any> {
    return request({
      url: this.api_url, qs: {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'apikey': this.api_key,
      }, json: true
    });
  }

  public async getSMA(symbol: string): Promise<any> {
    return request({
      url: this.api_url, qs: {
        'function': 'SMA',
        'symbol': symbol,
        'interval': 'daily',
        'time_period': 30,
        'series_type': 'close',
        'apikey': this.api_key,
      }, json: true
    });
  }

}
