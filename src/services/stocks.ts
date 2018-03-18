// Copyright 2018 Clément Bizeau
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
