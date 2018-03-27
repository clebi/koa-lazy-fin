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

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter, flatMap, map, toArray } from 'rxjs/operators';
import { AlphaVantageApi } from './alpha-vantage';

export class CloseHist {
  constructor(readonly symbol: string, readonly mstime: number, readonly close: number, readonly mvClose: number) { }
}

@injectable()
export class Stocks {

  private provider: AlphaVantageApi;

  constructor(
    @inject(AlphaVantageApi.name) provider: AlphaVantageApi,
  ) {
    this.provider = provider;
  }

  getCloseHist(symbol: string): Observable<CloseHist[]> {
    const smaRes = this.provider.getSMA(symbol);
    return this.provider.getHistory(symbol).pipe(
      flatMap(
        hist => smaRes.pipe(
          map(sma => new CloseHist(hist.symbol, hist.mstime, hist.close, sma.get(hist.mstime).value)),
        ),
      ),
      filter(value => value.close > 0),
      toArray(),
    );
  }

}
