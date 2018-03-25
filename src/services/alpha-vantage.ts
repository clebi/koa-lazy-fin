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
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { map, flatMap } from 'rxjs/operators';

class SMAPoint {
  constructor(readonly symbol: string, readonly mstime: number, readonly value: number) { }
}

class HistoryPoint {
  constructor(readonly symbol: string, readonly mstime: number, readonly close: number) { }
}

export class AlphaVantageApi {

  private readonly api_url = 'https://www.alphavantage.co/query';
  private readonly api_key = 'PQKR6O30ZYPDPABM';

  public getHistory(symbol: string): Observable<HistoryPoint> {
    return fromPromise(request({
      url: this.api_url, qs: {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'apikey': this.api_key,
      }, json: true
    })).pipe(
      map(value => new Map(Object.entries(value['Time Series (Daily)']))),
      flatMap(value => {
        let points = new Array<HistoryPoint>();
        value.forEach((value: any, key: string) => {
          points.push(new HistoryPoint(symbol, new Date(key).getTime(), value['4. close']));
        });
        return points;
      })
    );
  }

  public getSMA(symbol: string): Observable<Map<number, SMAPoint>> {
    return fromPromise(request({
      url: this.api_url, qs: {
        'function': 'SMA',
        'symbol': symbol,
        'interval': 'daily',
        'time_period': 30,
        'series_type': 'close',
        'apikey': this.api_key,
      }, json: true
    })).pipe(
      map(value => new Map(Object.entries(value['Technical Analysis: SMA']))),
      map(value => {
        let points = new Map<number, SMAPoint>();
        value.forEach((value: any, key: string) => {
          points.set(new Date(key).getTime(), new SMAPoint(symbol, new Date(key).getTime(), value['SMA']));
        });
        return points;
      })
    );
  }

}
