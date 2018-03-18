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

import * as Koa from 'koa';
import * as cors from 'koa2-cors';
import * as Router from 'koa-router';
import * as request from 'request-promise-native';
import { AlphaVantageApi, StocksApi } from './services/stocks';

const app = new Koa();
const router = new Router();
let stocksApi: StocksApi = new AlphaVantageApi();

class CloseHist {
  constructor(readonly symbol: string, readonly mstime: number, readonly close: number, readonly mv_close: number) { }
}

router.get('/history/list', async (ctx, next) => {
  let stocks = new Array<CloseHist[]>();
  for (let symbol of ctx.query.symbols) {
    var sma = await stocksApi.getSMA(symbol);
    var hist = await stocksApi.getHistory(symbol);
    let stock = new Array<CloseHist>();
    for (let day in hist['Time Series (Daily)']) {
      if (hist['Time Series (Daily)'][day]['4. close'] <= 0) {
        continue;
      }
      stock.push(new CloseHist(
        symbol,
        new Date(day).getTime(),
        hist['Time Series (Daily)'][day]['4. close'],
        sma['Technical Analysis: SMA'][day]['SMA'])
      );
    }
    stocks.push(stock);
  }
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(stocks);
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
